import { Hono } from 'hono';
import  Memcached from 'memcached';


import connectDB from './db.js';
import { User } from './models/User.js';



// Initialize Memcached
const memcached = new Memcached('localhost:11211');

memcached.stats((err, stats) => {
  if (err) {
    console.error('Memcached connection failed:', err);
  } else {
    console.log('Memcached connected successfully.');
  }
});

// Initialize Hono app
const app = new Hono();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use('*', async (c, next) => {
  c.req.parsedBody = await c.req.json().catch(() => ({}));
  await next();
});

// Sample route with caching
app.get('/test', async (c) => {
  const testKey = 'testKey';

  return new Promise((resolve) => {
    memcached.get(testKey, async (err, data) => {
      if (err) {
        console.error('Memcached get error:', err);
        resolve(c.json({ error: 'Memcached get failed' }, 500));
        return;
      }

      if (data) {
        console.log('Cache hit:', data);
        resolve(c.json(JSON.parse(data)));
        return;
      }

      console.log('Cache miss - fetching from DB');

      try {
        const testValue = await User.find();

        memcached.set(testKey, JSON.stringify(testValue),3600, (setErr) => {
          if (setErr) {
            console.error('Memcached set error:', setErr);
          } else {
            console.log('Data cached successfully:', testValue);
          }
        });

        resolve(c.json(testValue));
      } catch (dbErr) {
        console.error('Database query error:', dbErr);
        resolve(c.json({ error: 'Database query failed' }, 500));
      }
    });
  });
});

// Start the server
const port = process.env.PORT || 3005;
console.log(`Server is running on http://localhost:${port}`);
Bun.serve({
  fetch: app.fetch,
  port,
});
