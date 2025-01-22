const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: 'localhost',  // or 'redis' if using Docker Compose
    port: 6379
  }
});

// Connect explicitly before exporting
client.connect().then(() => {
  console.log('✅ Connected to Redis');
}).catch((err) => {
  console.error('❌ Redis connection error:', err);
});

client.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

module.exports = client;
