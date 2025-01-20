import Redis from 'ioredis'
require('dotenv').config()
const redisClient = new Redis({
    port:parseInt(process.env.REDIS_PORT || '6379',10),
    host:process.env.REDIS_HOST || 'localhost',
})

redisClient.on('connect', () => {
    console.log('Connected to Redis!');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisClient;


