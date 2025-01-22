import { createClient } from "redis";

const client = createClient({
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

export default client;