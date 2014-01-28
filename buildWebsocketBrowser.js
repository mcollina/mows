
var websocket = require('websocket-stream')

module.exports = function buildWebsocket(url, subprotocol, opts) {
  // protocol options cannot be forwarded.
  delete opts.protocol;
  return websocket(url, 'mqttv3.1', opts);
};
