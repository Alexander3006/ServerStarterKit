'use strict';

class BaseTransport {
  constructor(services) {
    this.services = services;
    this.logger = services.logger ?? {};
    this.handler = async () => {};
  }

  setHandler(handler) {
    if (typeof handler === 'function') {
      this.handler = handler;
    } else {
      throw new Error('The handler must be a function');
    }
    return this;
  }

  startListen() {
    throw new Error();
  }

  stopListen() {
    throw new Error();
  }
}

module.exports = BaseTransport;
