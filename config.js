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
  startup: './Startup.js',
  dependencies: './dependencies.js',
};

module.exports = configuration;
