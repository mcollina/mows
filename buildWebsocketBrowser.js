
var websocket = require('websocket-stream')

module.exports = function buildWebsocket(url, opts) {
  // protocol options cannot be forwarded.
  delete opts.protocol;
  return websocket(url, opts);
};
