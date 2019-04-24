const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const msg = (success, status) => ({
  success,
  status
});

app.get('/', (req, res) => {
  res.send(JSON.stringify(process.env));
});

app.post('/auth/register', async (req, res) => {
  if(!req.body || !req.body.username || !req.body.password) {
    res.status(400).json(msg(false, 'Required { username: String, password: String }'));
    return;
  }
  const result = await db.query(
    'SELECT * FROM users WHERE username = $1', [req.body.username]
    );
  console.log(result);
  res.status(200).json(msg(true, 'nothing'));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
