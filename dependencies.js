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
};

const nodeApi = {
  console,
  Promise,
  setTimeout,
  Buffer,
};

const services = {
  Logger: './Framework/Services/LoggerService.js',
  Router: './Framework/Services/RouteService.js',
  Controllers: './Framework/Services/Controllers/ControllerService.js',
  Sessions: './Framework/Services/Sessions/SessionService.js',
  SessionStorage: './Framework/Services/Sessions/SessionStorage.js',
  HttpConnection: './Framework/Transport/http/HttpConnection.js',
  HttpTransport: './Framework/Transport/http/HttpTransport.js',
  MemoryCache: './Framework/Infrastructure/MemoryCache.js',
};

module.exports = {
  npm,
  nodeApi,
  services,
};
