import { configDotenv } from 'dotenv';

configDotenv();

import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = createClient({ url: redisUrl });

async function run() {
  //* open connection to redis server
  await redis.connect();
  console.log('Connected to Redis Server');

  //? string
  const stringKey = 'demo:page_views';

  await redis.set(stringKey, 1);
  console.log('string', await redis.get(stringKey));

  //? redis strings can also work as counter

  const afterInc = await redis.incr(stringKey);
  console.log('afterInc', afterInc);

  //? hash in redis
  // * stores multiple values under one key
  // * key:demo:user:profile

  const hashKey = 'demo:user:profile';

  await redis.hSet(hashKey, {
    name: 'John Doe',
    age: 30,
    city: 'New York',
  });

  const profile = await redis.hGetAll(hashKey);
  console.log('hash', profile);

  // ? list in redis
  // * redis list are ordered collections of values

  const listKey = 'demo:users';

  await redis.lPush(listKey, ['Alice', 'Bob', 'Charlie']);
  const users = await redis.lRange(listKey, 0, -1);
  console.log('list', users);

  // * lRange is used to retrieve a range of elements from a list
  //* lPush is used to add elements to the beginning of a list
  //* lTrim is used to remove elements from a list
  //* lIndex is used to retrieve an element from a list by its index
  //* lLen is used to get the length of a list
  //* lPop is used to remove the last element from a list
  //* lPushX is used to add an element to the beginning of a list only if the list exists
  //* lRem is used to remove elements from a list by their value
  //*rPush is used to add elements to the end of a list
  //* rPushX is used to add an element to the end of a list only if the list exists

  //! set in redis
  // * redis set is a collection of unique values

  const setKey = 'demo:men';

  await redis.sAdd(setKey, 'nodejs');
  await redis.sAdd(setKey, 'nodejs');
  await redis.sAdd(setKey, 'reactjs');
  const usersSet = await redis.sMembers(setKey);
  console.log('set', usersSet);
  const count = await redis.sCard(setKey);
  console.log('count', count);

  const rankKey = 'demo:leaderboard';

  await redis.zAdd(rankKey, {
    score: 100,
    value: 'John Doe',
  });
  await redis.zAdd(rankKey, {
      score: 50,
      value: 'Jane Doe',
  })
  const leaderBoardScore=await redis.zRange(rankKey,0,-1);
  console.log('leaderBoardScore', leaderBoardScore);  

  const newScore=await redis.zIncrBy(rankKey,10,'John Doe');
  console.log(newScore);


  // ? redis ttl
  // * redis ttl is used to set a time-to-live for a key
  //* it tells us that how long the key will be valid before it is deleted automatically

  const otpKey='demo:otp:123456';
  // const ttl=await redis.ttl(otpKey);
  // console.log('ttl',ttl);

  // await redis.expire(otpKey,10);
  // const ttl=await redis.ttl(otpKey);
  // console.log('ttl',ttl);

  await redis.set(otpKey,'123456');
  await redis.expire(otpKey,60);

  const ttl=await redis.ttl(otpKey);
  console.log('ttl',ttl);



  // * ping the redis server
  console.log('ping', await redis.ping());


  await redis.quit();
}
run()
  .then(() => console.log('Finished'))
  .catch((err) => console.error(err));

// string
//* stores one value under one key
// * plain text,numbers stored as text,counters
// ? key:page_views
// ? value:1
