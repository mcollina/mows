/**
 * Testing dependencies
 */

var mqttOverWs = require('./')
  , mqtt = require('mqtt')
  , abstractClientTests = require("mqtt/test/abstract_client")
  , testServer = require("./test-server")
  , server = testServer.start();

/**
 * Modules to be tested
 */
var createClient = mqttOverWs.createClient;

describe('MqttClient', function() {
  abstractClientTests(server, createClient, testServer.port);
});

describe('mqttOverWs', function() {

  it("should expose MqttConnection", function() {
    mqttOverWs.MqttConnection.should.eql(mqtt.MqttConnection);
  });

  it("should expose MqttClient", function() {
    mqttOverWs.MqttClient.should.eql(mqtt.MqttClient);
  });
});
