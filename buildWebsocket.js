
var websocket = require('websocket-stream')

module.exports = function buildWebsocket(url, opts) {
  return websocket(url, opts);
};
