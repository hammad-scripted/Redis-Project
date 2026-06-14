import { configDotenv } from 'dotenv';

configDotenv();

import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = createClient({ url: redisUrl });

// ? cache key

const cacheKey = 'demo:products';
const cacheTtl = 60; // in seconds

const dbProducts = ['keyboard', 'mouse', 'monitor', 'hub', 'headset'];

async function run() {
  redis.connect();

  // ? first request - cache miss, it will hit the database

  let cachedData = await redis.get(cacheKey);

  // ? cached aside pattern

  if (cachedData) {
    console.log('Cached Hit');
    console.log('cached data', cachedData);
    console.log('Data:', JSON.parse(cachedData));
  } else {
    console.log('Cached miss');

    // ? cache miss, it will hit the database
    // ? read from db

    const products = dbProducts;

    await redis.setEx(cacheKey, cacheTtl, JSON.stringify(products));
  }

  redis.quit();
}

run();
