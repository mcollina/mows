
var websocket = require('websocket-stream')

module.exports = function buildWebsocket(url, protocol, opts) {
  opts = opts || {};
  opts.protocol = { protocol: 'mqttv3.1' };
  return websocket(url, opts);
};
