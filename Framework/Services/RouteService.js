class RouteService {
  constructor(services) {
    this.services = services;
    this.storage = {};
  }

  async indicatePath(connection) {
    const {services, storage} = this;
    const {url: urlParser} = npm;
    const {
      request: {url, method},
    } = connection;
    const {pathname} = urlParser.parse(url);
    const methodStorage = storage[method.toLowerCase()];
    if (methodStorage) {
      const endpoint = methodStorage.get(pathname);
      if (endpoint) {
        const {handler} = endpoint;
        await handler(connection, services);
      } else {
        connection.sendJson('Not Found');
      }
    } else {
      connection.sendJson('Not Found');
    }
  }

  registerEndpoint(options) {
    const {method, url, handler} = options;
    const {storage} = this;
    const normilizedMetod = method.toLowerCase();
    const methodStorage = storage[normilizedMetod];
    if (methodStorage) {
      methodStorage.set(url, {handler});
    } else {
      const methodStorage = (storage[normilizedMetod] = new Map());
      methodStorage.set(url, {handler});
    }
    return this;
  }

  _findHandlerInStorage(storage, value) {
    for (const [url, obj] of storage) {
      const {handler} = obj;
      if (handler.toString() === value.toString()) {
        return url;
      }
    }
    return false;
  }

  deleteController(handler) {
    const {storage, _findHandlerInStorage} = this;
    Object.values(storage).map((methodStorage) => {
      const url = _findHandlerInStorage(methodStorage, handler);
      if (url) {
        methodStorage.delete(url);
      }
    });
  }
}

RouteServiceProvider = (services) => {
  const router = new RouteService(services);
  return router;
};
