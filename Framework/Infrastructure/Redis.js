class Redis {
  constructor(logger) {
    const {redis} = node_modules;
    this.client = redis.createClient(configuration.redis);
    this.client.on('connect', () => {
      logger.info(`Redis connected`);
    });
    this.client.on('error', (err) => {
      logger.info(err);
    });
    return this.client;
  }
}

RedisProvider = (logger) => {
  const redis = new Redis(logger);
  return redis;
};
