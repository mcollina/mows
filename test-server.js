
var websocket = require('websocket-stream');
var mqtt = require("./");
var http = require("http");
var fs   = require("fs");

var port = module.exports.port = process.env.PORT || 9371;

var securePort = module.exports.securePort = 9374;

var handleClient = function (client) {

  var self = this;

  if (!self.clients) self.clients = {};

  client.on('connect', function(packet) {
    if (packet.clientId === 'invalid') {
      client.connack({returnCode: 2});
    } else {
      client.connack({returnCode: 0});
    }
    self.clients[packet.clientId] = client;
    client.subscriptions = [];
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

    for (var k in self.clients) {
      var c = self.clients[k]
      , publish = false;

      for (var i = 0; i < c.subscriptions.length; i++) {
        var s = c.subscriptions[i];

        if (s.test(packet.topic)) {
          publish = true;
        }
      }

      if (publish) {
        try {
          c.publish({topic: packet.topic, payload: packet.payload});
        } catch(error) {
          delete self.clients[k];
        }
      }
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
    var granted = [];

    for (var i = 0; i < packet.subscriptions.length; i++) {
        var qos = packet.subscriptions[i].qos
            , topic = packet.subscriptions[i].topic
            , reg = new RegExp(topic.replace('+', '[^\/]+').replace('#', '.+') + '$');

        granted.push(qos);
        client.subscriptions.push(reg);
    }

    client.suback({messageId: packet.messageId, granted: granted});
  });

  client.on('unsubscribe', function(packet) {
    client.unsuback(packet);
  });

  client.on('pingreq', function(packet) {
    client.pingresp();
  });
};

module.exports.ssl = {
  key:  fs.readFileSync('./examples/cert/94456535-localhost.key'),
  cert: fs.readFileSync('./examples/cert/94456535-localhost.cert')
};

module.exports.start = function(done) {

  var server = mqtt.createServer(handleClient);

  server.listen(port, done);

  return server;
};

module.exports.startSecure = function(done) {
  var secureOpts = {
    key:  module.exports.ssl.key,
    cert: module.exports.ssl.cert
  };

  var server = mqtt.createSecureServer(secureOpts, handleClient);
  server.listen(securePort, done);

  return server;
};

module.exports.createClient = mqtt.createClient;

if (!module.parent) {
  module.exports.start(function(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('MOWS server started on port ' + port);
  });
}
