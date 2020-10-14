'use strict';

const http = require('http');
const https = require('https');

class HttpTransport {
  constructor(config, ConnectionFactory) {
    const {ssl, port, ipAddress} = config;
    this.port = port;
    this.address = ipAddress;
    this.protocol = ssl ? https : http;
    this.connections = new Map();
    this.ConnectionFactory = ConnectionFactory;
    this.server = this.protocol.createServer(this._listener.bind(this));
    this.handler = async () => {};
  }

  async _listener(req, res) {
    const {connections, handler, ConnectionFactory} = this;
    const {socket} = res;
    const connection = new ConnectionFactory(req, res);
    connections.set(socket, connection);
    await handler(connection);
    res.on('close', () => {
      connections.delete(socket);
    });
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
    const {port, address, server} = this;
    server.listen(port, address, () => {
      console.dir(`Start server ${address}:${port}`);
    });
    return this;
  }

  async stopListen() {
    const {connections, server} = this;
    for (const [socket, connection] of connections.entries()) {
      connection.response.destroy();
      connections.delete(socket);
    }
    server.close(() => {
      console.dir(`Server closed`);
    });
  }
}

module.exports = HttpTransport;
