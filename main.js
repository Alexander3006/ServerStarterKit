'use strict';

const ApplicationBuilder = require('./Framework/ApplicationBuilder');
const configuration = require('./config');
const dependencies = require(configuration.dependencies);
const HttpTransport = require('./Framework/Transport/http/HttpTransport');
const HttpConnection = require('./Framework/Transport/http/HttpConnection');

(async () => {
  const applicationBuilder = new ApplicationBuilder()
    .setConfigurations(configuration)
    .setDependencies(dependencies)
    .useTransport(HttpTransport, HttpConnection);
  await applicationBuilder.buildServices();
  await applicationBuilder.build();
})();
