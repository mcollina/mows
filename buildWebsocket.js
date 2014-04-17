
var websocket = require('websocket-stream')

module.exports = function buildWebsocket(url, opts) {
  opts = opts || {};
  opts.protocol = 'mqttv3.1';
  return websocket(url, opts);
};
