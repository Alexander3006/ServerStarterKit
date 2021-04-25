(class Startup {
  configureServices(services) {
    services.addSingleton('logger', Logger);
    // services.addSingleton('db', Database);
    services.addSingleton('sessionStorage', MemorySessionStorage);
    services.addSingleton('sessions', Sessions);
  }

  async configure({logger, router}) {
    logger.info('Hello from Startup');
    const {HttpEndpoint, WSEndpoint} = adapters;
    router
      .registerEndpoint(
        new HttpEndpoint({
          method: 'GET',
          url: '/SayHello',
          handler: async ({connection}) => {
            connection.send('Hello');
          },
        }),
      )
      .registerEndpoint(
        new HttpEndpoint({
          method: 'GET',
          url: '/',
          handler: async ({connection}) => {
            connection.redirect('/test1');
          },
        }),
      )
      .registerEndpoint(
        new HttpEndpoint({
          method: 'PUT',
          url: '/getSecretCode',
          handler: async ({connection}) => {
            connection.send('Secret Code');
          },
        }),
      )
      .registerEndpoint(
        new WSEndpoint({
          url: 'TEST',
          handler: async ({connection, data}) => {
            connection.send(data);
          },
        }),
      );
  }
});
