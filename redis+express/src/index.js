const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const client = require('./redisClient');

const User = require('./models/User');

const app = express();
const port = 3006;

dotenv.config();

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async (req, res) => {
  const key = 'users';
  let users = await client.GET(key);
  if (users) {
    console.log('Fetching from cache');
    return res.json(JSON.parse(users));
  }
  users = await User.find();
  await client.SET(key, JSON.stringify(users), {
    EX: 3600,
  });
  console.log('Fetching from DB and storing in cache');
  return res.json(users);
});

app.get('/stats', async (req, res) => {
  try {
    const stats = await client.info();
    res.send(`<pre>${stats}</pre>`);
  } catch (err) {
    console.error('❌ Error fetching Redis stats:', err);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

