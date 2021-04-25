'use strict';

const node_modules = {
  fs: require('fs'),
  url: require('url'),
  path: require('path'),
  vm: require('vm'),
  crypto: require('crypto'),
  http: require('http'),
  https: require('https'),
  util: require('util'),
  redis: require('redis'),
  pg: require('pg'),
};

const ports = {
  BaseSessionStorage: require('./Framework/Services/Sessions/BaseSessionStorage'),
  BaseLoggerService: require('./Framework/Services/Logger/BaseLoggerService'),
  BaseConnection: require('./Framework/Transport/BaseConnection'),
  BaseTransport: require('./Framework/Transport/BaseTransport'),
};

const adapters = {
  HttpEndpoint: require('./Framework/Services/Router/HttpEndpoint'),
  WSEndpoint: require('./Framework/Services/Router/WSEndpoint'),
};

const nodeApi = {
  console,
  Promise,
  setTimeout,
  Buffer,
};

const services = {
  Logger: './Framework/Services/Logger/LoggerService.js',
  Sessions: './Framework/Services/Sessions/SessionService.js',
  MemorySessionStorage: './Framework/Services/Sessions/MemorySessionStorage.js',
  RedisSessionStorage: './Framework/Services/Sessions/RedisSessionStorage.js',
  Redis: './Framework/Infrastructure/Redis.js',
  Database: './Framework/Infrastructure/Database.js',
};

const routers = {
  router: './Framework/Services/Router/RouteService.js',
};

module.exports = {
  node_modules,
  nodeApi,
  services,
  adapters,
  ports,
  routers,
};
