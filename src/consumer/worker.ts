import Redis from 'ioredis';

const redis = new Redis({
  port: 6378,
});

redis.on('connect', () => {
  console.log('connected to redis');
  startWorker(1);
  startWorker(2);
  startWorker(3);
  startWorker(4);
  startWorker(5);
});

redis.on('error', (error) => {
  console.log(error);
});

const startWorker = async (id: number) => {
  try {
    while (true) {
      const response = await redis.brpop('post.like', 0);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};
