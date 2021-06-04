const {ILogger, ISessionService, ISessionStorage, IRouter} = interfaces;
const {HttpEndpoint, WSEndpoint} = adapters;

(class Startup {
  configureServices(services) {
    services.addSingleton(ILogger, Logger);
    // services.addSingleton('db', Database);
    services.addSingleton(ISessionStorage, MemorySessionStorage);
    services.addSingleton(ISessionService, Sessions);
    services.addSingleton(IRouter, Router);
  }

  async configure({[ILogger]: logger, [IRouter]: router}) {
    logger.info('Hello from Startup');
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
