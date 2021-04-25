'use strict';

const ApplicationBuilder = require('./Framework/ApplicationBuilder');
const configuration = require('./config');
const {controllers, http, ws, dependencies: depPath} = require('./config');
const dependencies = require(depPath);
const HttpTransport = require('./Framework/Transport/http/HttpTransport');
const HttpEndpoint = require('./Framework/Services/Router/HttpEndpoint');
const WsTransport = require('./Framework/Transport/ws/WsTransport');
const WSEndpoint = require('./Framework/Services/Router/WSEndpoint');

(async () => {
  try {
    const applicationBuilder = new ApplicationBuilder()
      .setConfigurations(configuration)
      .setDependencies(dependencies);
    await applicationBuilder.buildServices();
    await applicationBuilder.build();
    const httpTransport = applicationBuilder
      .useTransport(HttpTransport, HttpEndpoint, {
        router: 'router',
        transport: http,
        controllers,
      })
      .startListen();
    const wsTransport = applicationBuilder
      .useTransport(WsTransport, WSEndpoint, {
        router: 'router',
        transport: ws,
        controllers: false,
      })
      .startListen();

    //test
    setTimeout(() => {
      httpTransport.stopListen();
      wsTransport.stopListen();
    }, 5000);
  } catch (err) {
    console.dir(err);
  }
})();
