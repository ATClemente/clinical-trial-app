/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
const saltRounds = 5;
const SECRET = 'fdSj3sdAd59daSqLDasieQ9osM';

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const msg = (success, status) => ({
  success,
  status
});

const auth = (success, status, token) => ({
  success,
  status,
  jwt: token
});

const jwtSign = username => {
  return jwt.sign(
    {
      username,
      exp: Date.now() / 1000 + 60 * 60 * 24 * 7
    },
    SECRET
  );
};

const findOne = async username => {
  const user = await db.query('SELECT * FROM users WHERE username = $1', [
    username
  ]);
  if (user.rowCount) {
    return user.rows[0];
  }
  return null;
};

app.get('/', (req, res) => {
  res.send(JSON.stringify(process.env));
});

app.post('/auth/register', async (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    res
      .status(400)
      .json(
        msg(false, 'Error: Required { username: String, password: String }')
      );
    return;
  }
  try {
    const user = findOne(req.query.username);
    if (user) {
      res.status(403).json(msg(false, 'Error: Username already exists'));
    } else {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      await db.query('INSERT INTO users(username, password) VALUES($1, $2)', [
        req.body.username,
        hash
      ]);
      const token = jwtSign(req.body.username);
      res.status(201).json(auth(true, 'Account created', token));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(msg(false, 'Error: Server error'));
  }
});

app.post('/auth/login', async (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    res
      .status(400)
      .json(
        msg(false, 'Error: Required { username: String, password: String }')
      );
    return;
  }
  try {
    const user = findOne(req.query.username);
    if (!user) {
      res.status(401).json(msg(false, 'Error: Invalid credentials'));
    } else {
      const passwordHash = user.password;
      const match = await bcrypt.compare(req.body.password, passwordHash);
      if (!match) {
        res.status(401).json(msg(false, 'Error: Invalid credentials'));
      } else {
        const token = jwtSign(req.body.username);
        res.status(200).json(auth(true, 'Valid', token));
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(msg(false, 'Error: Server error'));
  }
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
