var websocket = require('websocket-stream')
var mqtt = require("mqtt");

module.exports.createClient = function(port, host, opts) {
  if ('object' === typeof port) {
    opts = port;
    port = serverPort;
    host = 'localhost';
  } else if ('object' === typeof host) {
    opts = host;
    host = 'localhost';
  } else if ('object' !== typeof opts) {
    opts = {};
  }

  if (!host) {
    host = 'localhost'
  }

  if (opts && opts.clean === false && !opts.clientId) {
    throw new Error("Missing clientId for unclean clients");
  }

  var build = function() {
    var url = 'ws://' + host + ':' + port;
    var stream = websocket(url, { type: Uint8Array });

    return stream;
  };

  return new mqtt.MqttClient(build, opts);
};

module.exports.MqttClient = mqtt.MqttClient;
module.exports.MqttConnection = mqtt.MqttConnection;
