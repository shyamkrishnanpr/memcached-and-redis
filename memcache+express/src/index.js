import express from 'express';
import Memcached from 'memcached';
import dotenv from 'dotenv';

import connectDB from './db.js';
import User from './models/user.js';


dotenv.config();

const memcached = new Memcached('localhost:11211');


memcached.stats((err, stats) => {
  if (err) {
    console.error('Memcached connection failed:');
  } else {
    console.log('Memcached connected:');
  }
});

const app = express();
const port = process.env.PORT || 3005;

connectDB();


app.use(express.json());


// Sample route
app.get('/test', (req, res) => {
  const testKey = 'test';

  memcached.get(testKey, (err, data) => {
    if (err) {
      console.error('Failed to get value from Memcached:', err);
      return res.status(500).send('Memcached get failed');
    }

    if (data) {
      console.log('Cache hit:', data);
      return res.json(JSON.parse(data));
    }

    console.log('Cache miss');
    // Fetch data from the database inside the callback
    User.find()
      .then((testValue) => {

        memcached.set(testKey, JSON.stringify(testValue), 3600, (setErr) => {
          if (setErr) {
            console.error('Failed to set value in Memcached:', setErr);
            return res.status(500).send('Memcached set failed');
          }

          console.log('Value set successfully in Memcached:', testValue);
          res.json(testValue);
        });
      })
      .catch((dbErr) => {
        console.error('Database query failed:', dbErr);
        res.status(500).send('Database query failed');
      });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

