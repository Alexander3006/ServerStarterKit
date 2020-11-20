(class Startup {
  configureServices(services) {
    services.addSingleton('logger', Logger);
    services.addSingleton('Endpoint', Endpoint);
    services.addSingleton('router', Router);
    services.addSingleton('controllerService', ControllerService);
    services.addSingleton('db', Database);
    services.addTransient('memoryCache', MemoryCache);
    services.addSingleton('sessionStorage', SessionStorage);
    services.addSingleton('sessions', Sessions);
    services.addSingleton('Connection', HttpConnection);
    services.addSingleton('transport', HttpTransport);
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
