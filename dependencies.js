'use strict';

const npm = {
  fs: require('fs'),
  url: require('url'),
  path: require('path'),
  vm: require('vm'),
  crypto: require('crypto'),
  cookieParser: require('cookie'),
  http: require('http'),
  https: require('https'),
  util: require('util'),
  redis: require('redis'),
  pg: require('pg'),
};

const nodeApi = {
  console,
  Promise,
  setTimeout,
  Buffer,
};

const services = {
  Logger: './Framework/Services/LoggerService.js',
  Endpoint: './Framework/Services/Router/Endpoint.js',
  Router: './Framework/Services/Router/RouteService.js',
  ControllerService: './Framework/Services/Controllers/ControllerService.js',
  Sessions: './Framework/Services/Sessions/SessionService.js',
  SessionStorage: './Framework/Services/Sessions/SessionStorage.js',
  HttpConnection: './Framework/Transport/http/HttpConnection.js',
  HttpTransport: './Framework/Transport/http/HttpTransport.js',
  MemoryCache: './Framework/Infrastructure/MemoryCache.js',
  Database: './Framework/Infrastructure/Database.js',
};

module.exports = {
  npm,
  nodeApi,
  services,
};
