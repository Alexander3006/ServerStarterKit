class Endpoint {
  constructor(controller) {
    const { method, url, handler } = controller;
    this.method = method;
    this.handler = handler;
    this.url = url;
  }

  async _restoreSession(connection, services) {
    const { sessions } = services;
    const session = await sessions.restore(connection);
    return session;
  }

  async execute(connection, services) {
    const { handler } = this;
    const { sessions } = configuration;
    const session = sessions
      ? await this._restoreSession(connection, services)
      : null;
    const context = {
      services,
      session,
    };
    await handler(connection, context);
  }
}

EndpointProvider = () => () => Endpoint;
