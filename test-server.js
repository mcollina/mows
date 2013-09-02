
var fake = require("./fake-server");
var websocket = require('websocket-stream');
var mqtt = require("./");
var http = require("http");

var port = module.exports.port = fake.port;

module.exports.start = function(done) {

  var server = mqtt.createServer(function (client) {

    client.on('connect', function(packet) {
      if (packet.clientId === 'invalid') {
        client.connack({returnCode: 2});
      } else {
        client.connack({returnCode: 0});
      }
    });

    client.on('publish', function (packet) {
      switch (packet.qos) {
        case 0:
          break;
        case 1:
          client.puback(packet);
        break;
        case 2:
          client.pubrec(packet);
        break;
      }
    });

    client.on('pubrel', function(packet) {
      client.pubcomp(packet);
    });

    client.on('pubrec', function(packet) {
      client.pubrel(packet);
    });

    client.on('pubcomp', function(packet) {
      // Nothing to be done
    });

    client.on('subscribe', function(packet) {
      client.suback({
        messageId: packet.messageId,
        granted: packet.subscriptions.map(function (e) {
          return e.qos;
        })
      });
    });

    client.on('unsubscribe', function(packet) {
      client.unsuback(packet);
    });

    client.on('pingreq', function(packet) {
      client.pingresp();
    });
  });

  server.listen(port, done);

  return server;
};

if (!module.parent) {
  module.exports.start(function(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('MQTT.js-over-websocket server started on port ' + port);
  });
}
