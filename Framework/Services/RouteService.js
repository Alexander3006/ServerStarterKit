class RouteService {
  constructor(logger) {
    this.logger = logger;
    this.map = {};
  }

  async indicatePath(connection) {
    const {url: urlParser} = npm;
    const {
      request: {url, method},
    } = connection;
    const {pathname} = urlParser.parse(url);
    const methodStorage = this.map[method.toLowerCase()];
    if (methodStorage) {
      const endpoint = methodStorage.get(pathname);
      if (endpoint) {
        const {handler} = endpoint;
        await handler(connection);
      } else {
        connection.sendJson('Not Found');
      }
    } else {
      connection.sendJson('Not Found');
    }
  }

  registerEndpoint(options) {
    const {method, url, handler} = options;
    const {map} = this;
    const normilizedMetod = method.toLowerCase();
    const methodStorage = this.map[normilizedMetod];
    if (methodStorage) {
      methodStorage.set(url, {handler});
    } else {
      const methodStorage = (map[normilizedMetod] = new Map());
      methodStorage.set(url, {handler});
    }
    return this;
  }
}

RouteServiceProvider = (logger) => {
  const router = new RouteService(logger);
  return router;
};
