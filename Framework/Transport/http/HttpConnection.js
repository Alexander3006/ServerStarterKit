'use strict';
//this class will be supplemented so far it is just a stub
class HttpConnection {
  constructor(req, res) {
    this.request = req;
    this.response = res;
  }

  setHeaders(headers) {
    const {response} = this;
    Object.keys(headers).map((headerType) => {
      response.setHeader(headerType, headers[headerType]);
    });
    return this;
  }

  sendJson(data) {
    const json = JSON.stringify(data);
    this.response.end(json);
  }
}

module.exports = HttpConnection;
