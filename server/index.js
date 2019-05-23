/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const request = require('request');
//import { parse } from 'node-html-parser';
const {parse} = require('node-html-parser')
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

const serverError = () => {
  msg(false, 'Server error');
};

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
    res.status(500).json(serverError);
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
    res.status(500).json(serverError);
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

app.patch('/user/profile', async (req, res) => {
  try {
    let user = await findOne(req.profile.username);
    await db.query(
      'UPDATE users SET email=$1, dob=$2, gender=$3, zip=$4, cancertype=$5 WHERE username=$6',
      [
        req.body.email || req.profile.email,
        req.body.dob || req.profile.dob,
        req.body.gender || req.profile.gender,
        req.body.location || req.profile.location,
        req.body.cancerType || req.profile.cancerType,
        req.profile.username
      ]
    );
    user = await findOne(req.profile.username);
    const profile = {
      username: user.username,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      location: user.zip,
      cancerType: user.cancertype
    };
    res
      .status(200)
      .json(auth(true, 'Updated', req.header('Authorization'), profile));
  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
});

app.get('/user/trials', async (req, res) => {
  try {
    const result = await db.query(
      // 'select t.trial_id, t.created_date, d.title, d.phase, d.age, d.gender, d.organization, d.investigator, d.update from users u ' +
      //   'inner join user_trials t on t.user_id = u.id ' +
      //   'inner join trial_details d on d.trial_id = t.trial_id ' +
      //   'where username = $1',
      'SELECT ut.trial_id, ut.created_date FROM users u INNER JOIN user_trials ut ON u.id = ut.user_id WHERE u.username = $1',
      [req.profile.username]
    );
    const trialIds = result.rowCount ? result.rows : [];
    res.status(200).json({
      username: req.profile.username,
      success: true,
      savedTrials: trialIds
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(serverError);
  }
});

app.post('/user/trials', async (req, res) => {
  if (!req.body || !req.body.trialId) {
    res.status(400).json(msg(false, 'Body required: { trialId: STRING }'));
    return;
  }

  // try {
  //   await db.query(
  //     'INSERT INTO trial_details(trial_id, title, phase, age, gender, organization, investigator) ' +
  //       'VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (trial_id) DO UPDATE ' +
  //       'SET title=$2, phase=$3, age=$4, gender=$5, organization=$6, investigator=$7',
  //     [
  //       req.body.trialId,
  //       req.body.title,
  //       req.body.phase,
  //       req.body.age,
  //       req.body.gender,
  //       req.body.organization,
  //       req.body.investigator
  //     ]
  //   );
  // } catch (e) {
  //   res.status(500).json(serverError);
  //   return;
  // }

  try {
    await db.query(
      'INSERT INTO user_trials(user_id, trial_id) VALUES($1, $2)',
      [req.profile.id, req.body.trialId]
    );
  } catch (e) {
    if (e.code === '23505') {
      res.status(403).json(msg(false, 'Trial already exists for user'));
      return;
    }
    res.status(500).json(serverError);
    return;
  }

  try {
    const result = await db.query(
      // 'select t.trial_id, t.created_date, d.title, d.phase, d.age, d.gender, d.organization, d.investigator, d.update from users u ' +
      //   'inner join user_trials t on t.user_id = u.id ' +
      //   'inner join trial_details d on d.trial_id = t.trial_id ' +
      //   'where username = $1',
      'SELECT ut.trial_id, ut.created_date FROM users u INNER JOIN user_trials ut ON u.id = ut.user_id WHERE u.username = $1',
      [req.profile.username]
    );
    const trialIds = result.rowCount ? result.rows : [];
    res.status(200).json({
      username: req.profile.username,
      success: true,
      status: 'Trial saved',
      savedTrials: trialIds
    });
  } catch (e) {
    res.status(500).json(serverError);
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
    res.status(500).json(serverError);
  }
});

app.get('/drugs/', async(req, res) =>
{
  request('https://www.centerwatch.com/drug-information/fda-approved-drugs/therapeutic-area/12/oncology', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.


    const root = parse(body);
    const contents = root.querySelector('#ctl00_BodyContent_AreaDetails')
    
    console.log(contents)
   // console.log(root.querySelector('#ctl00_BodyContent_AreaDetails'));
  
    //res.status(200).json(contents);
  });

 

});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

