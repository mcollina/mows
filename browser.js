var websocket = require('websocket-stream');
var mqtt = require("mqtt");

module.exports.createClient = function(port, host, opts) {
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

  if (opts && opts.clean === false && !opts.clientId) {
    throw new Error("Missing clientId for unclean clients");
  }

  var build = function(){

    var websocketOpts = { type: Uint8Array };

    if(opts.protocol)
    {
        websocketOpts.protocol = opts.protocol;
    }

    var stream = websocket(url, websocketOpts);

    return stream;
  };

  return new mqtt.MqttClient(build, opts);
};

module.exports.createConnection = function(port, host, callback) {
  var url = null
    , ws
    , conn;

  if ('string' === typeof port) {
    url = port;
  }

  if (!host) {
    host = 'localhost'
  }

  if (!url && host && port) {

     var protocol = '';
     if(host.slice(0,6).toLowerCase() != 'wss://' && host.slice(0,5).toLowerCase() != 'ws://')
     {
        protocol = 'ws://'
     }

     url = protocol + host + ':' + port;
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
