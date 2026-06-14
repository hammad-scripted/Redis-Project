import { createClient } from 'redis';
import { configDotenv } from 'dotenv';
configDotenv();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = createClient({
  url: redisUrl,
});

// * attach the event listener
redis.on('ready', () => {
  console.log('Redis Client Connected');
});

redis.on('connect', () => {
  console.log('Connected to Redis');
  
});

redis.on('error', (err) => {
  console.log(err);
});

redis.on('end', () => {
  console.log('Redis Client Disconnected');
});


export async function connectRedis(){
    //? if the redis client is not open, then we need to open it
    if(!redis.isOpen){
        await redis.connect();
    }
    console.log(`Redis client ping:`, await redis.ping());
}

export async function disconnectRedis(){

    // ? if the redis client is open, then we need to close it
    if(redis.isOpen){
        await redis.quit();
    }
}   