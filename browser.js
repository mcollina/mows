var websocket = require('websocket-stream')
var mqtt = require("mqtt");

module.exports.createClient = function(port, host, opts) {
  var url = null;

  if ('object' === typeof port) {
    opts = port;
    url = 'ws://localhost';
  } else if ('string' === typeof port) {
    url = port;
  }
  
  if ('object' === typeof host) {
    opts = host;
  } else if ('object' !== typeof opts) {
    opts = {};
  }

  if (!host) {
    host = 'localhost'
  }

  if (!url && host && port) {
    url = 'ws://' + host + ':' + port;
  }

  if (opts && opts.clean === false && !opts.clientId) {
    throw new Error("Missing clientId for unclean clients");
  }

  var build = function() {
    var stream = websocket(url, { type: Uint8Array });

    return stream;
  };

  return new mqtt.MqttClient(build, opts);
};

module.exports.createConnection = function(port, host, callback) {
  var url = null
    , ws
    , conn;

  if ('object' === typeof port) {
    opts = port;
    url = 'ws://localhost';
  } else if ('string' === typeof port) {
    url = port;
  }
  
  if ('object' === typeof host) {
    opts = host;
  } else if ('object' !== typeof opts) {
    opts = {};
  }

  if (!host) {
    host = 'localhost'
  }

  if (!url && host && port) {
    url = 'ws://' + host + ':' + port;
  }

  ws = websocket(url, { type: Uint8Array });
  conn = ws.pipe(new mqtt.MqttConnection());

  // Echo net errors
  ws.on('error', conn.emit.bind(conn, 'error'));

  ws.on('close', conn.emit.bind(conn, 'close'));

  ws.on('connect', function() {
    conn.emit('connected');
  });

  return conn;
};

module.exports.MqttClient = mqtt.MqttClient;
module.exports.MqttConnection = mqtt.MqttConnection;
