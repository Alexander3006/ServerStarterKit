'use strict';

const DIContainer = require('./DIContainer');
const vm = require('vm');
const fsp = require('fs').promises;

const startupFileName = './Startup.js';

const npm = {
  fs: require('fs'),
};
const nodeApi = {
  console,
  Promise,
};

const services = {
  Logger: './Services/LoggerService.js',
};

class ApplicationBuilder {
  constructor() {
    this.services = {};
    this.dependencies = {npm, nodeApi};
    this.container = new DIContainer();
    this.startup;
  }

  async buildServices() {
    Object.keys(services).map(async (serviceName) => {
      const servicePath = services[serviceName];
      const src = await fsp.readFile(servicePath);
      const sandbox = vm.createContext(this.dependencies);
      const script = vm.createScript(src);
      const service = script.runInNewContext(sandbox);
      this.services[serviceName] = service;
    });
  }

  async build() {
    const {services} = this;
    const sandbox = vm.createContext(services);
    const src = await fsp.readFile(startupFileName);
    const script = vm.createScript(src);
    const Startup = script.runInNewContext(sandbox);
    this.startup = new Startup();
    const {startup, container} = this;
    startup.configureServices(container);
    const application = container.build();
    startup.configure(application);
  }
}

module.exports = ApplicationBuilder;
