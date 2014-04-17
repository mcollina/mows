/**
 * Environment variables
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Ignore self-signed certificate errors

/**
 * Testing dependencies
 */

var mqttOverWs = require('./')
  , mqtt = require('mqtt')
  , abstractClientTests = require("mqtt/test/abstract_client")
  , testServer = require("./test-server")
  , server = testServer.start()
  , secureServer = testServer.startSecure()

var secureClientOpts = {
  protocol: {
    ca: testServer.ssl.cert
  }
};

function clientTests(buildClient) {
  var client;

  beforeEach(function() {
    client = buildClient();
  });

  afterEach(function(done) {
    client.once("close", done);
    client.end();
  });

  it("should connect", function(done) {
    client.on("connect", function() {
      done();
    });
  });

  it("should publish and subscribe", function(done) {
    client.subscribe("hello", function() {
      done();
    }).publish("hello", "world");
  });
}

describe('MqttClient', function() {
  describe("specifying a port", function() {
    clientTests(function() {
      return mqttOverWs.createClient(testServer.port);
    });
  });

  describe("specifying a port and host", function() {
    clientTests(function() {
      return mqttOverWs.createClient(testServer.port, 'localhost');
    });
  });

  describe("specifying a URL", function() {
    clientTests(function() {
      return mqttOverWs.createClient('ws://localhost:' + testServer.port);
    });
  });

  if (process.title === 'browser') {
    describe("specifying nothing", function() {
      clientTests(function() {
        return mqttOverWs.createClient();
      });
    });
  }

  if (process.title === 'node') {
    describe("specifying a port, secure URL and secure client options", function(){
      clientTests(function(){
        return mqttOverWs.createClient(testServer.securePort, 'wss://localhost', secureClientOpts);
      });
    });

    describe("specifying a URL and secure client options", function(){
      clientTests(function(){
        return mqttOverWs.createClient('wss://localhost:' + testServer.securePort, secureClientOpts);
      });
    });
  }
});


function connectionTests(buildconn) {
  var conn;

  var connPacket = {
    keepalive: 60,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    reconnectPeriod: 1000,
    clean: true,
    encoding: 'utf8',
    clientId: 'ahahah'
  };

  var publishPacket = {
    topic: "hello",
    payload: "world",
    qos: 0,
    retain: false,
    messageId: 42
  };

  var subscribePacket = {
    subscriptions: [{
      topic: "hello",
      qos: 0
    }],
    messageId: 42
  };

  beforeEach(function() {
    conn = buildconn();
  });

  afterEach(function() {
    conn.stream.destroy()
  });

  it("should publish and subscribe", function(done) {
    conn.connect(connPacket);

    conn.on("connack", function() {
      conn.subscribe(subscribePacket);
    });
    conn.on('suback', function(packet) {
      conn.publish(publishPacket);
    });
    conn.on('publish', function() {
      done();
    });
  });
}

describe('MqttConnection', function() {
  describe("specifying a port", function() {
    connectionTests(function() {
      return mqttOverWs.createConnection(testServer.port);
    });
  });

  describe("specifying a port and host", function() {
    connectionTests(function() {
      return mqttOverWs.createConnection(testServer.port, 'localhost');
    });
  });

  describe("specifying a URL", function() {
    connectionTests(function() {
      return mqttOverWs.createConnection('ws://localhost:' + testServer.port);
    });
  });

  if (process.title === 'node') {
    describe("specifying a port and secure URL", function() {
      connectionTests(function() {
        return mqttOverWs.createConnection(testServer.securePort, 'wss://localhost');
      });
    });

    describe("specifying a port, secure URL and secure Client options", function() {
      connectionTests(function() {
        return mqttOverWs.createConnection(testServer.securePort, 'wss://localhost', secureClientOpts);
      });
    });

    describe("specifying a secure URL", function() {
      connectionTests(function() {
        return mqttOverWs.createConnection('wss://localhost:' + testServer.securePort);
      });
    });
  }
});

describe('mqttOverWs', function() {

  it("should expose MqttConnection", function() {
    mqttOverWs.MqttConnection.should.eql(mqtt.MqttConnection);
  });

  it("should expose MqttClient", function() {
    mqttOverWs.MqttClient.should.eql(mqtt.MqttClient);
  });
});
