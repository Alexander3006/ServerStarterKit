'use strict';

const DIContainer = require('./DI/DIContainer');
const vm = require('vm');
const fsp = require('fs').promises;

class ApplicationBuilder {
  constructor() {
    this.services = {};
    this.dependencies;
    this.container = new DIContainer();
    this.startup;
    this.configuration = {};
    this.servicesPaths;
  }

  setConfigurations(configuration) {
    this.configuration = configuration;
    return this;
  }

  setDependencies(dependencies) {
    const { npm, nodeApi, services } = dependencies;
    this.dependencies = { npm, nodeApi };
    this.servicesPaths = services;
    return this;
  }

  async buildServices() {
    const { servicesPaths, dependencies, configuration } = this;
    await Promise.all(
      Object.keys(servicesPaths).map(async (serviceName) => {
        const servicePath = servicesPaths[serviceName];
        const src = await fsp.readFile(servicePath);
        const sandbox = vm.createContext({ ...dependencies, configuration });
        const script = vm.createScript(src);
        const service = script.runInNewContext(sandbox);
        this.services[serviceName] = service;
      }),
    );
  }

  async build() {
    const { services, dependencies, configuration } = this;
    const context = { ...services, ...dependencies, configuration };
    const sandbox = vm.createContext(context);
    const src = await fsp.readFile(configuration.startup);
    const script = vm.createScript(src);
    const Startup = script.runInNewContext(sandbox);
    this.startup = new Startup();
    const { startup, container } = this;
    startup.configureServices(container);
    const application = container.build();
    await startup.configure(application);
  }
}

module.exports = ApplicationBuilder;
