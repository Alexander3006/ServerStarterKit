class RouteService {
  constructor(Endpoint, services) {
    this.Endpoint = Endpoint;
    this.services = services;
    this.storage = {};
  }

  async indicatePath(connection) {
    const {url: urlParser} = npm;
    const {
      request: {url, method},
    } = connection;
    const {services} = this;
    const {pathname} = urlParser.parse(url);
    const endpoint = this._searchEndpoint(method, pathname);
    if (!endpoint) {
      connection.error(404, 'Not found');
      return;
    }
    await endpoint?.execute(connection, services);
  }

  _searchEndpoint(method, pathname) {
    const {storage} = this;
    const methodStorage = storage[method.toLowerCase()];
    const endpoint = methodStorage?.get(pathname);
    return endpoint;
  }

  registerEndpoint(options) {
    const {method, url} = options;
    const {storage, Endpoint} = this;
    const normilizedMetod = method.toLowerCase();
    const methodStorage = storage[normilizedMetod];
    const endpoint = new Endpoint(options);
    if (methodStorage) {
      methodStorage.set(url, endpoint);
    } else {
      const methodStorage = (storage[normilizedMetod] = new Map());
      methodStorage.set(url, endpoint);
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

  deleteEndpoint(handler) {
    const {storage, _findHandlerInStorage} = this;
    Object.values(storage).map((methodStorage) => {
      const url = _findHandlerInStorage(methodStorage, handler);
      if (url) {
        methodStorage.delete(url);
      }
    });
  }
}

RouteServiceProvider = (Endpoint, services) => {
  const router = new RouteService(Endpoint, services);
  return router;
};
