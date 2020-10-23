'use strict';

const configuration = {
  transport: {
    ipAddress: '0.0.0.0',
    port: 3000,
    ssl: false,
  },
  controllers: {
    paths: ['./Controllers'],
    supervisor: true,
  },
  sessions: {
    maxAge: 30000,
    httpOnly: true,
    path: '/',
  },
  memoryCache: {
    host: '127.0.0.1',
    port: 6379,
  },
  startup: './Startup.js',
  dependencies: './dependencies.js',
};

module.exports = configuration;
