class SessionStorage {
  constructor(memoryCache) {
    this.storage = memoryCache;
  }

  set(token, data) {
    const {storage} = this;
    const json = JSON.stringify(data);
    return new Promise((res, rej) => {
      storage.set(token, json, (err, reply) => {
        err ? rej(err) : res(reply);
      });
    });
  }

  async get(token) {
    const {storage} = this;
    const session = await new Promise((res, rej) => {
      storage.get(token, (err, reply) => {
        err ? rej(err) : res(reply);
      });
    });
    return JSON.parse(session);
  }

  delete(token) {
    const {storage} = this;
    return new Promise((res, rej) => {
      storage.del(token, (err, reply) => {
        err ? rej(err) : res(reply);
      });
    });
  }

  stop() {
    const {storage} = this;
    storage.quit();
    return;
  }
}

SessionStorageProvider = (memoryCache) => {
  const sessionStorage = new SessionStorage(memoryCache);
  return sessionStorage;
};
