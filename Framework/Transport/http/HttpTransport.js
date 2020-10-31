class HttpTransport {
  constructor(Connection, logger) {
    const { ssl, port, ipAddress } = configuration.transport;
    const { http, https } = npm;
    this.port = port;
    this.address = ipAddress;
    this.protocol = ssl ? https : http;
    this.connections = new Map();
    this.Connection = Connection;
    this.logger = logger;
    this.server = this.protocol.createServer(this._listener.bind(this));
    this.handler = async () => {};
  }

  async _listener(req, res) {
    const { connections, handler, Connection } = this;
    const { socket } = res;
    const connection = new Connection(req, res);
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
    const { port, address, server, logger } = this;
    server.listen(port, address, () => {
      logger.print(`Start server ${address}:${port}`);
    });
    return this;
  }

  async stopListen() {
    const { connections, server, logger } = this;
    for (const [socket, connection] of connections.entries()) {
      connection.response.destroy();
      connections.delete(socket);
    }
    server.close(() => {
      logger.print(`Server closed`);
    });
  }
}

TransportProvider = (Connection, logger) => {
  const httpTransport = new HttpTransport(Connection, logger);
  return httpTransport;
};
