(class Startup {
  configureServices(services) {
    services.addSingelton('logger', Logger);
    services.addSingelton('router', Router);
    services.addSingelton('controllers', Controllers);
  }

  async configure({logger, transport, router, controllers}) {
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
    }, 1000);
    transport.startListen();
  }
});
