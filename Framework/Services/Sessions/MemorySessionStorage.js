class MemmorySessionStorage extends ports.BaseSessionStorage {
  constructor() {
    super();
    this.storage = new Map();
  }

  set(token, data) {
    const {storage} = this;
    storage.set(token, data);
    return;
  }

  get(token) {
    const {storage} = this;
    const session = storage.get(token);
    return session;
  }

  delete(token) {
    const {storage} = this;
    storage.delete(token);
  }
}

MemmorySessionStorageProvider = () => {
  const sessionStorage = new MemmorySessionStorage();
  return sessionStorage;
};
