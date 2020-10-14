'use strict';

const ApplicationBuilder = require('./Framework/ApplicationBuilder');
const configurations = require('./config');
const HttpTransport = require('./Framework/Transport/http/HttpTransport');
const HttpConnection = require('./Framework/Transport/http/HttpConnection');

(async () => {
  const applicationBuilder = new ApplicationBuilder()
    .setConfigurations(configurations)
    .useTransport(HttpTransport, HttpConnection);
  await applicationBuilder.buildServices();
  await applicationBuilder.build();
})();
