var websocket = require('websocket-stream');
var mqtt = require("mqtt");

var getParams = function(port, host, opts) {

  var url = null;

  if ('object' === typeof port) {
    opts = port;
    url = 'localhost';
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
    url = host + ':' + port;
  }

  if(url.slice(0,5).toLowerCase() != "ws://" && url.slice(0,6).toLowerCase() != "wss://") {
    url = "ws://" + url;
  }

  var websocketOpts = {
    type: Uint8Array
  };

  if(opts.protocol)
  {
    websocketOpts.protocol = opts.protocol;
  }

  return {
    url: url,
    opts: opts,
    websocketOpts: websocketOpts
  }

};

module.exports.createClient = function(port, host, opts) {

  var params = getParams(port, host, opts);

  if (params.opts && params.opts.clean === false && !params.opts.clientId) {
    throw new Error("Missing clientId for unclean clients");
  }

  var build = function() {
    return websocket(params.url, params.websocketOpts);
  };

  return new mqtt.MqttClient(build, params.opts);
};

module.exports.createConnection = function(port, host, opts) {
  var ws
    , conn;

  var params = getParams(port, host, opts);

  ws = websocket(params.url, params.websocketOpts);
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
