(class Startup {

  configureServices(services) {
    services.addSingelton('logger', Logger);

  }

  configure(application) {
    const { logger } = application;
    logger.print('Hello from Startup');
  }

  start() {

  }
});
