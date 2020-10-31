class Sessions {
  constructor(sessionStorage) {
    const TOKEN_LEN = 256 / 8;
    this.sessionStorage = sessionStorage;
    this.configuration = configuration.sessions;
    this._tokenLength = TOKEN_LEN;
  }

  async _generateToken() {
    const { crypto } = npm;
    const { _tokenLength } = this;
    const token = await new Promise((res, rej) => {
      crypto.randomBytes(_tokenLength, (err, buf) => {
        err ? rej(err) : res(buf);
      });
    }).then((x) => x.toString('hex'));
    return token;
  }

  async create(connection, data) {
    const { sessionStorage, configuration } = this;
    const { maxAge, httpOnly, path } = configuration;
    const token = await this._generateToken();
    await sessionStorage.set(token, data);
    connection.setCookie('token', token, {
      maxAge,
      httpOnly,
      path,
    });
    return token;
  }

  async restore(connection) {
    const { sessionStorage } = this;
    const cookie = connection.getCookies();
    const { token } = cookie;
    if (token) {
      const session = await sessionStorage.get(token);
      return session;
    }
    return;
  }

  async delete(connection, token) {
    const { sessionStorage, cookieConfiguration } = this;
    const { httpOnly, path } = cookieConfiguration;
    await sessionStorage.delete(token);
    connection.setCookie('token', token, {
      maxAge: 0,
      httpOnly,
      path,
    });
  }

  stop() {
    const { sessionStorage } = this;
    sessionStorage.stop();
    return;
  }
}

SessionsProvider = (sessionStorage) => {
  const sessions = new Sessions(sessionStorage);
  return sessions;
};
