/**
 * Testing dependencies
 */

var mqttOverWs = require('./')
  , mqtt = require('mqtt')
  , abstractClientTests = require("mqtt/test/abstract_client")
  , testServer = require("./test-server")
  , server = testServer.start();

describe('MqttClient', function() {
  var client;

  beforeEach(function() {
    client = mqttOverWs.createClient(testServer.port);
  });

  afterEach(function(done) {
    client.on("close", done);
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
});

describe('mqttOverWs', function() {

  it("should expose MqttConnection", function() {
    mqttOverWs.MqttConnection.should.eql(mqtt.MqttConnection);
  });

  it("should expose MqttClient", function() {
    mqttOverWs.MqttClient.should.eql(mqtt.MqttClient);
  });
});
