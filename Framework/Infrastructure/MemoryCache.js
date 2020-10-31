class MemoryCache {
  constructor(logger) {
    const { redis } = npm;
    const { memoryCache } = configuration;
    this.client = redis.createClient(memoryCache);
    this.client.on('connect', () => {
      logger.print(`Memory cache connected`);
    });
    this.client.on('error', (err) => {
      logger.print(err);
    });
    return this.client;
  }
}

MemoryCacheProvider = (logger) => {
  const memoryCache = new MemoryCache(logger);
  return memoryCache;
};
