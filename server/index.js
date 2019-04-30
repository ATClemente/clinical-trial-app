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

const auth = (success, status, token, profile) => ({
  success,
  status,
  jwt: token,
  profile
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

const jwtVerify = token => {
  jwt.verify(token, SECRET, (err, decoded) => {
    return decoded;
  });
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
  res.send('Welcome');
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
    const user = await findOne(req.body.username);
    if (user) {
      res.status(403).json(msg(false, 'Error: Username already exists'));
    } else {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      await db.query('INSERT INTO users(username, password) VALUES($1, $2)', [
        req.body.username,
        hash
      ]);
      const token = jwtSign(req.body.username);
      const profile = {
        username: req.body.username
      };
      res.status(201).json(auth(true, 'Account created', token, profile));
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
    const user = await findOne(req.body.username);
    if (!user) {
      res.status(401).json(msg(false, 'Error: Invalid credentials'));
      return;
    }
    const passwordHash = user.password;
    const match = await bcrypt.compare(req.body.password, passwordHash);
    if (!match) {
      res.status(401).json(msg(false, 'Error: Invalid credentials'));
    } else {
      const token = jwtSign(req.body.username);
      const profile = {
        username: user.username,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        location: user.zip,
        cancerType: user.cancertype
      };
      res.status(200).json(auth(true, 'Valid', token, profile));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(msg(false, 'Error: Server error'));
  }
});

app.use('/user', async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json('Error: Authorization required');
    return;
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json('Error: Authorization required');
      return;
    }
    findOne(decoded.username)
      .then(user => {
        if (user) {
          req.profile = user;
          next();
        } else {
          throw Error('Username not found');
        }
      })
      .catch(e => {
        res.status(404).json(msg(false, e.toString()));
      });
  });
});

app.put('/user/profile', async (req, res) => {
  try {
    await db.query(
      'UPDATE users SET email=$1, dob=$2, gender=$3, zip=$4, cancertype=$5 WHERE username=$6',
      [
        req.body.email,
        req.body.dob,
        req.body.gender,
        req.body.location,
        req.body.cancerType,
        req.profile.username
      ]
    );
    const token = jwtSign(req.profile.username);
    const user = await findOne(req.profile.username);
    const profile = {
      username: user.username,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      location: user.zip,
      cancerType: user.cancertype
    };
    res.status(200).json(auth(true, 'Updated', token, profile));
  } catch (err) {
    console.log(err);
    res.status(500).json(msg(false, 'Server error'));
  }
});

app.get('/user/trials', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM user_trials ut ' +
        'INNER JOIN users u on ut.user_id = u.id ' +
        'WHERE u.username = $1',
      [req.profile.username]
    );
    const trialIds = result.rowCount
      ? result.rows.map(item => {
          return { trialId: item.trial_id, createdDate: item.created_date };
        })
      : [];
    res.status(200).json({
      username: req.profile.username,
      success: true,
      savedTrials: trialIds
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(msg(false, 'Server error'));
  }
});

app.post('/user/trials', async (req, res) => {
  try {
    await db.query(
      'INSERT INTO user_trials(user_id, trial_id) VALUES($1, $2)',
      [req.profile.id, req.body.trialId]
    );
    const result = await db.query(
      'SELECT * FROM user_trials ut ' +
        'INNER JOIN users u on ut.user_id = u.id ' +
        'WHERE u.username = $1',
      [req.profile.username]
    );
    const trialIds = result.rowCount
      ? result.rows.map(item => {
          return { trialId: item.trial_id, createdDate: item.created_date };
        })
      : [];
    res.status(200).json({
      username: req.profile.username,
      success: true,
      status: 'Trial saved',
      savedTrials: trialIds
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(msg(false, 'Server error'));
  }
});

app.delete('/user/trials/:tid', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM user_trials WHERE user_id=$1 AND trial_id=$2',
      [req.profile.id, req.params.tid]
    );
    if (result.rowCount) {
      res.status(200).json(msg(true, 'Trial deleted'));
      return;
    }
    res.status(404).json(msg(false, 'Trial not found'));
  } catch (e) {
    console.log(e);
    res.status(500).json(msg(false, 'Server error'));
  }
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
