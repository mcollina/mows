var websocket = require('websocket-stream')
var WebSocketServer = require('ws').Server;
var mqtt = require("mqtt");
var http = require("http");
var https = require("https");

module.exports = Object.create(require("./client"));

module.exports.attachServer = function(server, handler) {
  var wss = new WebSocketServer({server: server})

  wss.on('connection', function(ws) {
    var stream = websocket(ws);
    var connection = stream.pipe(new module.exports.MqttConnection());

    stream.on('error', connection.emit.bind(connection, 'error'));
    stream.on('close', connection.emit.bind(connection, 'close'));

    if (handler)
      handler(connection);

    server.emit("client", connection);
  });

  return server;
};

module.exports.createServer = function(handler) {
  var server = http.createServer();
  module.exports.attachServer(server, handler);
  return server;
};

module.exports.createSecureServer = function(httpsOpts, handler) {
    var server = https.createServer(httpsOpts);
    module.exports.attachServer(server, handler);
    return server;
};
