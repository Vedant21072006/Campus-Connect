import { createClient } from 'redis';

console.log('REDIS URL:', process.env.REDIS_URL);

const redisClient = createClient({
  url:"redis://default:6ysJFUQD9G2Vrt0yH0X67ADtXVcwyGNG@childlike-bluebell-sagely-28101.db.redis.io:14828"
});

redisClient.on('connect', () => {
  console.log('✅ Redis Connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err);
});

export const connectRedis = async () => {
  await redisClient.connect();
};

export default redisClient;