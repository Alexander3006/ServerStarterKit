(class Startup {
  configureServices(services) {
    services.addSingelton('logger', Logger);
    services.addSingelton('router', Router);
    services.addSingelton('controllers', Controllers);
    services.addTransient('memoryCache', MemoryCache);
    services.addSingelton('sessionStorage', SessionStorage);
    services.addSingelton('sessions', Sessions);
    services.addSingelton('connection', HttpConnection);
    services.addSingelton('transport', HttpTransport);
  }

  async configure({ logger, transport, router, controllers, sessions}) {
    logger.print('Hello from Startup');

    await controllers.start(configuration);

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
        handler: async (connection, appication) => {
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
      controllers.stopSupervisor();
      sessions.stop();
    }, 1000);
    transport.startListen();
  }
});
