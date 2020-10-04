'use strict';

const parseFunction = require('parse-function')();

class DIContainer {
  constructor() {
    this.container = new Proxy({}, {
      get: (target, name) => {
        if (name in target) {
          const Service = target[name];
          return this._isFunction(Service)
            ? new Service()
            : Service;
        } else {
          throw new Error(`The ${name} service does not exist`);
        }
      }
    });
  }

  _isFunction(obj) {
    return typeof obj === 'function';
  }

  _inject(serviceFactory) {
    if (this._isFunction(serviceFactory)) {
      const serviceFactoryArgsName = parseFunction.parse(serviceFactory).args;
      const args = [];
      serviceFactoryArgsName.map(argName => {
        args.push(this.container[argName]);
      });
      return serviceFactory.bind(null, ...args);
    } else {
      throw new Error(`The ${serviceFactory.name} service is not a function`);
    }
  }

  addSingelton(serviceName, serviceFactory) {
    const Service = this._inject(serviceFactory);
    const singeltonService = new Service();
    this.container[serviceName] = singeltonService;
    return this;
  }

  addTransient(serviceName, serviceFactory) {
    const service = this._inject(serviceFactory);
    this.container[serviceName] = service;
    return this;
  }

  build() {
    Object.freeze(this.container);
    return this.container;
  }
}

module.exports = DIContainer;
