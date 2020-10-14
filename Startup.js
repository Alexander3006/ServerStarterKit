(class Startup {
  configureServices(services) {
    services.addSingelton('logger', Logger);
    services.addSingelton('router', Router);
    // nodeApi.console.dir(Router);
  }

  configure({logger, transport, router}) {
    logger.print('Hello from Startup');

    router
      .registerEndpoint({
        method: 'GET',
        url: '/SayHello',
        handler: async (connection) => {
          connection.sendJson('Hello');
        },
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

    transport.startListen();
  }
});
