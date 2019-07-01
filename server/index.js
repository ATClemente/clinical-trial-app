/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { parse } = require('node-html-parser');
const request = require('request');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const url = require('url');
const exphbs = require('express-handlebars');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const saltRounds = 10;
const SECRET = 'fdSj3sdAd59daSqLDasieQ9osM';

const SENDGRID_API_KEY =
  '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';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

const findOneByColumn = async (column, value) => {
  /* Table and column names need to be string literals, can't use $1 */
  const user = await db.query(`SELECT * FROM users WHERE ${column}=$1`, [
    value
  ]);
  return user.rowCount ? user.rows[0] : null;
};

app.get('/', (req, res) => {
  res.send('Welcome');
});

app.post('/auth/register', async (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res
      .status(400)
      .json(
        msg(false, 'Error: Required { username: String, password: String }')
      );
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
    return res
      .status(400)
      .json(
        msg(false, 'Error: Required { username: String, password: String }')
      );
  }
  try {
    const user = await findOne(req.body.username);
    if (!user) {
      return res.status(401).json(msg(false, 'Error: Invalid credentials'));
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
        cancerType: user.cancertype,
        showOnboarding: user.show_onboarding
      };
      res.status(200).json(auth(true, 'Valid', token, profile));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
});

app.get('/auth/forgot', async (req, res) => {
  if (!req.query || !req.query.email) {
    return res
      .status(400)
      .json(msg(false, 'Error: Required query string param { email: String }'));
  }
  try {
    const user = await findOneByColumn('email', req.query.email);
    if (!user) {
      return res.status(404).json(msg(false, 'Error: email not found'));
    }

    const buffer = crypto.randomBytes(20);
    const resetToken = buffer.toString('hex');

    await db.query('UPDATE users SET resetpwdtoken=$1 WHERE username=$2', [
      resetToken,
      user.username
    ]);

    const baseUrl = url.format({
      protocol: req.protocol,
      host: req.get('host')
    });
    const resetPwdLink = `${baseUrl}/auth/reset/${resetToken}`;

    const emailMsg = {
      to: user.email,
      from: 'no-reply@clinical-trial-app.herokuapp.com',
      subject: 'Clinical Trial App - Reset Your Password',
      html: `<p><strong>You've requested to reset your password</strong></p><p><a href='${resetPwdLink}'>Click here to reset your password</a></p>`
    };
    sgMail.send(emailMsg);

    return res.status(200).json(msg(true, 'Reset password email sent'));
  } catch (e) {
    res.status(500).json(serverError);
  }
});

app.get('/auth/reset/:token', async (req, res) => {
  try {
    const user = await findOneByColumn('resetpwdtoken', req.params.token);
    if (!user) {
      return res.status(404).send('Not authorized');
    }
    res.render('reset');
  } catch (e) {
    res.status(500).json(serverError);
  }
});

app.post('/auth/reset/:token', async (req, res) => {
  try {
    const user = await findOneByColumn('resetpwdtoken', req.params.token);
    if (!user) {
      return res.status(404).send('Not authorized');
    }
    if (
      !req.body ||
      !req.body.password ||
      !req.body.confirmPassword ||
      req.body.password !== req.body.confirmPassword
    ) {
      return res.status(400).send('Invalid parameters');
    }
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    await db.query(
      'UPDATE users SET password=$1, resetpwdtoken=NULL WHERE username=$2',
      [hash, user.username]
    );

    const emailMsg = {
      to: user.email,
      from: 'no-reply@clinical-trial-app.herokuapp.com',
      subject: 'Clinical Trial App - Password was Reset',
      html: '<p>Your password to Clinical Trial App has been reset.</p>'
    };
    sgMail.send(emailMsg);

    return res.send('Password reset');
  } catch (e) {
    res.status(500).json(serverError);
  }
});

app.use('/user', async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json('Error: Authorization required');
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json('Error: Authorization required');
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

app.get('/user/profile', async (req, res) => {
  try {
    const user = await findOne(req.profile.username);
    const profile = {
      username: user.username,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      location: user.zip,
      cancerType: user.cancertype,
      showOnboarding: user.show_onboarding
    };
    return res.status(200).json({ success: true, profile });
  } catch (e) {
    console.log(e);
    res.status(500).json(serverError);
  }
});

app.patch('/user/profile', async (req, res) => {
  try {
    let user = await findOne(req.profile.username);
    // console.log(user);
    await db.query(
      'UPDATE users SET email=$1, dob=$2, gender=$3, zip=$4, cancertype=$5, show_onboarding=$6 WHERE username=$7',
      [
        req.body.email || req.profile.email,
        req.body.dob || req.profile.dob,
        req.body.gender || req.profile.gender,
        req.body.location || req.profile.zip,
        req.body.cancerType || req.profile.cancertype,
        req.body.showOnboarding !== undefined
          ? req.body.showOnboarding
          : req.profile.show_onboarding,
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
      cancerType: user.cancertype,
      showOnboarding: user.show_onboarding
    };
    return res.status(200).json({ success: true, status: 'Updated', profile });
  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
});

app.put('/user/profile', async (req, res) => {
  try {
    let user = await findOne(req.profile.username);
    // console.log(user);
    await db.query(
      'UPDATE users SET email=$1, dob=$2, gender=$3, zip=$4, cancertype=$5, show_onboarding=$6 WHERE username=$7',
      [
        req.body.email,
        req.body.dob,
        req.body.gender,
        req.body.location,
        req.body.cancerType,
        req.body.showOnboarding,
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
      cancerType: user.cancertype,
      showOnboarding: user.show_onboarding
    };
    return res.status(200).json({ success: true, status: 'Updated', profile });
  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
});

app.get('/user/trials', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT ut.trial_id, ut.created_date FROM users u INNER JOIN user_trials ut ON u.id = ut.user_id WHERE u.username = $1',
      [req.profile.username]
    );
    const trialIds = result.rowCount ? result.rows : [];
    return res.status(200).json({
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
    return res
      .status(400)
      .json(msg(false, 'Body required: { trialId: STRING }'));
  }

  try {
    await db.query(
      'INSERT INTO user_trials(user_id, trial_id) VALUES($1, $2)',
      [req.profile.id, req.body.trialId]
    );
  } catch (e) {
    if (e.code === '23505') {
      return res.status(403).json(msg(false, 'Trial already exists for user'));
    }
    return res.status(500).json(serverError);
  }

  try {
    const result = await db.query(
      'SELECT ut.trial_id, ut.created_date FROM users u INNER JOIN user_trials ut ON u.id = ut.user_id WHERE u.username = $1',
      [req.profile.username]
    );
    const trialIds = result.rowCount ? result.rows : [];
    return res.status(200).json({
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
      return res.status(200).json(msg(true, 'Trial deleted'));
    }
    res.status(404).json(msg(false, 'Trial not found'));
  } catch (e) {
    console.log(e);
    res.status(500).json(serverError);
  }
});

app.post('/user/trials/share', async (req, res) => {
  if (!req.body || !req.body.email || !req.body.username || !req.body.trial) {
    return res
      .status(400)
      .json('Required { email: STRING, username: STRING, trial: OBJECT }');
  }
  try {
    const baseUrl = 'https://clinicaltrials.gov/ct2/show/';
    const emailMsg = {
      to: req.body.email,
      from: 'no-reply@clinical-trial-app.herokuapp.com',
      subject: `Clinical Trial App - ${
        req.body.username
      } shared a trial with you`,
      html:
        `<p>${req.body.username} shared a clinical trial with you.</p>` +
        `<p><strong>Title: </strong>${req.body.trial.title}</p>` +
        `<p><strong>Phase: </strong>${req.body.trial.phase.phase}</p>` +
        `<p><strong>Summary: </strong>${req.body.trial.summary}</p>` +
        `<p><strong>Link: </strong>${baseUrl}${req.body.trial.id}</p>`
    };
    await sgMail.send(emailMsg);
    res.status(201).json(msg(true, 'Email sent'));
  } catch (e) {
    console.log(e);
    res.status(500).json(serverError);
  }
});

app.get('/drugs', async (req, res) => {
  request(
    'https://www.centerwatch.com/drug-information/fda-approved-drugs/therapeutic-area/12/oncology',
    (error, response, body) => {
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      if (error) {
        return res
          .status(500)
          .send(`statusCode: ${response && response.statusCode}`);
      }
      try {
        const root = parse(body);
        const contents = root.querySelector('#ctl00_BodyContent_AreaDetails');
        const drugs = contents.childNodes.filter(e => e.tagName === 'p');
        const result = drugs.map((e, index) => {
          const text = e.childNodes[1].rawText.split(';');
          const baseUrl = 'https://www.centerwatch.com';
          const link = e.childNodes[0].rawAttrs
            .split(' ')[1]
            .split('=')[1]
            .slice(1, -1);
          return {
            index,
            link: baseUrl + link,
            id: link.split('/')[4],
            name: e.childNodes[0].childNodes[0].rawText.trim(),
            manufacturer: text[1].trim(),
            description: text[2].split(', Approved ')[0].trim(),
            approval_date: text[2].split(', Approved ')[1]
          };
        });
        return res.status(200).json(result);
      } catch (e) {
        res.status(500).json('Server error');
      }
    }
  );
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
