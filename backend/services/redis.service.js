import Redis from 'ioredis';

const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
        if (times > 3) {
            console.error('Redis connection failed after 3 retries');
            return null;
        }
        return Math.min(times * 100, 3000);
    }
});

redisClient.on('connect', () => {
    console.log('Redis connected to localhost:6379');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err.message);
});

export default redisClient;