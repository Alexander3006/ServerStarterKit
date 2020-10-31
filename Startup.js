(class Startup {
  configureServices(services) {
    services.addSingelton('logger', Logger);
    services.addSingelton('Endpoint', Endpoint);
    services.addSingelton('router', Router);
    services.addSingelton('controllerService', ControllerService);
    services.addSingelton('db', Database);
    services.addTransient('memoryCache', MemoryCache);
    services.addSingelton('sessionStorage', SessionStorage);
    services.addSingelton('sessions', Sessions);
    services.addSingelton('Connection', HttpConnection);
    services.addSingelton('transport', HttpTransport);
  }

  async configure({ logger, transport, router, controllerService, sessions }) {
    logger.print('Hello from Startup');
    await controllerService.start(configuration);

    router
      .registerEndpoint({
        method: 'GET',
        url: '/SayHello',
        handler: async (connection) => {
          connection.sendJson('Hello');
        },
      })
      .registerEndpoint({
        method: 'GET',
        url: '/redirect',
        handler: async (connection) => {
          connection.redirect('/ok');
        }
      })
      .registerEndpoint({
        method: 'PUT',
        url: '/getSecretCode',
        handler: async (connection) => {
          connection.sendJson('Secret Code');
        },
      });

    transport.setHandler(async (connection) => {
      await router.indicatePath(connection);
    });
    nodeApi.setTimeout(() => {
      transport.stopListen();
      controllerService.stopSupervisor();
      sessions.stop();
    }, 1000);
    transport.startListen();
  }
});
