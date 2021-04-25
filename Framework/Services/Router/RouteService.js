class RouteService {
  constructor(services) {
    this.services = services;
    this.storage = {};
  }

  indicatePath(request) {
    const {
      path: {pathname, method},
      connection,
    } = request;
    const {services} = this;
    const endpoint = this._searchEndpoint(method, pathname);
    if (!endpoint) {
      connection.error(404, `Edpdoint: ${method}:${pathname} not found`);
      return;
    }
    endpoint.execute(request, services);
  }

  _searchEndpoint(method, pathname) {
    const {storage} = this;
    const methodStorage = storage[method.toLowerCase()];
    const endpoint = methodStorage?.get(pathname);
    return endpoint;
  }

  registerEndpoint(endpoint) {
    const {storage} = this;
    const url = endpoint.getUrl();
    const method = endpoint.getMethod();
    const methodStorage = storage[method] ?? new Map();
    methodStorage.set(url, endpoint);
    storage[method] = methodStorage;
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
      if (url) methodStorage.delete(url);
    });
  }
}

RouteServiceProvider = (services) => {
  const router = new RouteService(services);
  return router;
};
