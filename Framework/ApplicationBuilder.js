'use strict';

const DIContainer = require('./DIContainer');
const vm = require('vm');
const fsp = require('fs').promises;

const startupFileName = './Startup.js';

const npm = {
  fs: require('fs'),
  url: require('url'),
};
const nodeApi = {
  console,
  Promise,
  setTimeout,
};

const services = {
  Logger: './Services/LoggerService.js',
  Router: './Framework/Services/RouteService.js',
};

class ApplicationBuilder {
  constructor() {
    this.services = {};
    this.dependencies = {npm, nodeApi};
    this.container = new DIContainer();
    this.startup;
    this.configuration = {};
  }

  setConfigurations(configuration) {
    this.configuration = configuration;
    return this;
  }

  async buildServices() {
    await Promise.all(
      Object.keys(services).map(async (serviceName) => {
        const servicePath = services[serviceName];
        const src = await fsp.readFile(servicePath);
        const sandbox = vm.createContext(this.dependencies);
        const script = vm.createScript(src);
        const service = script.runInNewContext(sandbox);
        this.services[serviceName] = service;
      }),
    );
  }

  async build() {
    const {services, dependencies} = this;
    const context = {...services, ...dependencies};
    const sandbox = vm.createContext(context);
    const src = await fsp.readFile(startupFileName);
    const script = vm.createScript(src);
    const Startup = script.runInNewContext(sandbox);
    this.startup = new Startup();
    const {startup, container} = this;
    startup.configureServices(container);
    const application = container.build();
    startup.configure(application);
  }

  useTransport(ITransport, IConnection) {
    const {
      configuration: {transport: config},
      container,
    } = this;
    container.addSingelton('transport', () => {
      const transport = new ITransport(config, IConnection);
      return transport;
    });
    return this;
  }
}

module.exports = ApplicationBuilder;
