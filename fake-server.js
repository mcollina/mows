
var server;
var mqtt = require("./");
var EventEmitter = require("events").EventEmitter;

module.exports.port = parseInt(window.location.port);

module.exports.securePort = 9354;

module.exports.start = function(callback) {
  if (callback) {
    callback();
  }

  server = new EventEmitter();

  return server;
};

module.exports.startSecure = function(callback) {
  if (callback) {
    callback();
  }

  server = new EventEmitter();

  return server;
};

// faking options
module.exports.ssl = {};

module.exports.createClient = function(port, host, options) {
  var client = mqtt.createClient(port, host, options);
  client.clientId = client.options.clientId;

  process.nextTick(function() {
    server.emit("client", client);
  });

  return client;
}
