
var server;
var mqtt = require("./");
var EventEmitter = require("events").EventEmitter;

module.exports.port = 9347;

module.exports.start = function(callback) {
  if (callback) {
    callback();
  }

  server = new EventEmitter();

  return server;
};

module.exports.createClient = function(port, host, options) {
  var client = mqtt.createClient(port, host, options);
  client.clientId = client.options.clientId;

  process.nextTick(function() {
    server.emit("client", client);
  });

  return client;
}
