import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db.js'
import User from './models/User.js'
import client from './redisClient.js'


const app = new Hono()

connectDB()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/users', async (c) => {
  const key = 'users';
  let users: any = await client.GET(key);
  if (users) {
    console.log('Fetching from cache');
    return c.json(JSON.parse(users));
  }
  users = await User.find();
  await client.SET(key, JSON.stringify(users), {
    EX: 3600,
  });
  console.log('Fetching from DB and storing in cache');
  return c.json(users);
});



const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
