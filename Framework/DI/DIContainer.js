'use strict';

const DS = require('./DependencySolver');
const parseFunction = require('parse-function')();

const SINGLETON = 1;
const TRANSIENT = 2;
const TypeGet = {
  [SINGLETON]: (provider) => provider,
  [TRANSIENT]: (provider) => provider(),
};
const TypeSet = {
  [TRANSIENT]: (provider) => provider,
  [SINGLETON]: (provider) => provider(),
};
const SERVICES = 'services';

module.exports = class DIContainer {
  constructor() {
    this.isBuild = false;
    this.metadata = {};
    this.graph = new DS();
    this.container = new Proxy(
      {},
      {
        get: (target, name) => {
          if (name === SERVICES) return this.container;
          if (name in target) {
            const {type, provider} = target[name];
            return TypeGet[type](provider);
          } else {
            throw new Error(`The ${name} service does not exist`);
          }
        },
        set: (target, prop, value) => {
          if (this.isBuild) return false;
          const {type, provider} = value;
          target[prop] = {
            type,
            provider: TypeSet[type](provider),
          };
          return true;
        },
      },
    );
  }

  _isFunction(fn) {
    return typeof fn === 'function';
  }

  _registerService(serviceName, serviceFactory) {
    if (serviceName === SERVICES) {
      throw new Error(`invalid service name: ${serviceName}`);
    }
    const {graph, _isFunction} = this;
    if (!_isFunction(serviceFactory)) {
      throw new Error(`The ${serviceName} service is not a function`);
    }
    const {args: deps} = parseFunction.parse(serviceFactory);
    graph.addNode(
      serviceName,
      deps.filter((dep) => dep !== SERVICES),
    );
    return deps;
  }

  _inject(provider, dependencies) {
    const args = dependencies.map((dep) => this.container[dep]);
    return provider.bind(null, ...args);
  }

  addSingleton(serviceName, serviceFactory) {
    const dependencies = this._registerService(serviceName, serviceFactory);
    this.metadata[serviceName] = {
      type: SINGLETON,
      provider: serviceFactory,
      dependencies,
    };
    return this;
  }

  addTransient(serviceName, serviceFactory) {
    const dependencies = this._registerService(serviceName, serviceFactory);
    this.metadata[serviceName] = {
      type: TRANSIENT,
      provider: serviceFactory,
      dependencies,
    };
    return this;
  }

  build() {
    const {graph, metadata, container} = this;
    const solutions = graph.getSolvedDependency();
    solutions.map((solution) => {
      const {name} = solution;
      const {type, provider, dependencies} = metadata[name];
      const bindedProveder = this._inject(provider, dependencies);
      container[name] = {
        type,
        provider: bindedProveder,
      };
    });
    this.isBuild = true;
    return container;
  }
};
