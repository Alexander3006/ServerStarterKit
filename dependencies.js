'use strict';

const npm = {
  fs: require('fs'),
  url: require('url'),
  path: require('path'),
  vm: require('vm'),
};

const nodeApi = {
  console,
  Promise,
  setTimeout,
};

const services = {
  Logger: './Services/LoggerService.js',
  Router: './Framework/Services/RouteService.js',
  Controllers: './Framework/Services/ControllerService.js',
};

module.exports = {
  npm,
  nodeApi,
  services,
};
