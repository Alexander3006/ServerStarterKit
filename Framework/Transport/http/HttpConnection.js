//this class will be supplemented so far it is just a stub
class HttpConnection {
  constructor(req, res) {
    this.request = req;
    this.response = res;
  }

  async receiveBody() {
    const { Buffer } = nodeApi;
    const { request } = this;
    const chunks = [];
    for await (const chunk of request) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks).toString();
    return buffer;
  }

  setCookie(name, value, params) {
    const { cookieParser } = npm;
    const { response } = this;
    const cookie = cookieParser.serialize(name, value, params);
    response.setHeader('Set-Cookie', cookie);
    return;
  }

  getCookies() {
    const { cookieParser } = npm;
    const { request } = this;
    const { cookie } = request.headers;
    if (cookie) {
      return cookieParser.parse(cookie);
    }
    return {};
  }

  redirect(path) {
    const { response } = this;
    response.writeHead(301, {
      Location: path,
    });
    response.end();
  }

  error(code, err) {
    const { response } = this;
    response.writeHead(code);
    response.end(JSON.stringify(err));
    return;
  }

  setHeaders(headers) {
    const { response } = this;
    Object.keys(headers).map((headerType) => {
      response.setHeader(headerType, headers[headerType]);
    });
    return this;
  }

  sendJson(data) {
    const { response } = this;
    const json = JSON.stringify(data);
    response.writeHead(200);
    response.end(json);
  }
}

HttpConnectionProvider = () => () => HttpConnection;
