var websocket = require('websocket-stream')
var WebSocketServer = require('ws').Server;
var mqtt = require("mqtt");
var browser = require("./browser");
var http = require("http");

module.exports = Object.create(browser);

module.exports.attachServer = function(server, handler) {
  var wss = new WebSocketServer({server: server})

  wss.on('connection', function(ws) {
    var connection = websocket(ws).pipe(new module.exports.MqttConnection());
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
