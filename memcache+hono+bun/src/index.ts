import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import Memcached from 'memcached'
import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db.js'
import { User } from './models/User.js'


const app = new Hono()
connectDB();

const memcached = new Memcached('localhost:11211')

memcached.stats((err, stats) => {
  if (err) {
    console.error('Memcached connection failed:');
  } else {
    console.log('Memcached connected:');
  }
})


app.get('/', (c) => {
  return c.text('Hello Hono!')
})



app.get('/test', async (c) => {
  const testKey = 'testKey';

  try {
    const users = await new Promise((resolve, reject) => {
      memcached.get(testKey, (err, data) => {
        if (err) {
          console.error('Failed to get value from Memcached:', err);
          return reject(new Error('Memcached get failed'));
        }
        else if (data) {
          console.log('cache hit');
          return resolve(data);
        }
        else {
          return resolve(null);
        }
      });

    })


    if (users) {
      return c.json(users);
    }

    const usersFromDB = await User.find();

    memcached.set(testKey, JSON.stringify(usersFromDB), 3600, (err) => {
      if (err) {
        console.error('Failed to set value in Memcached:', err);
      }
      console.log('data set in cache');
    });

    return c.json(usersFromDB);

  } catch (error) {
    return c.json({ error: 'Memcached get failed' });
  }



});




const port = 3005
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
