/**
 * This script demonstrates a MOWS NodeJS client connecting to a server over HTTP and HTTPS.
 *
 * It relies on the server script located at 'examples/server/server.js'.
 */

var mows = require('../../index');
var fs = require('fs');

/**
 * Simple method to assist in adding events to a client
 */
var applyEventHandlers = function (client, msg) {
  client.on('connect', function () {
    console.log('Client Connected as ', client.options.clientId);
    client.subscribe('/hiworld');
    client.publish('/hiworld', msg);
  });

  client.on('error', function (e) {
    console.log('Client Error:', e);
  });

  client.on('message', function (topic, message) {
    console.log('Client received message:', topic, message);
    client.end();
  });
};

/**
 * Example #1 - connect to a unsecure MOWS server
 */
var unsecureClient = mows.createClient(665, 'ws://localhost');
applyEventHandlers(unsecureClient, 'Hello, I am a unsecure client');


/**
 * Example #2 - connect to a secure MOWS server
 *
 * When creating a client in Node, use the 'protocol' property to pass additional
 * configuration paramaters to pass to the HTTPS request.
 * See http://nodejs.org/api/https.html#https_https_request_options_callback
 */
var secureClientOpts = {
  protocol: {
    ca: fs.readFileSync('../cert/94456535-localhost.cert')
  }
};

var secureClient = mows.createClient(666, 'wss://localhost', secureClientOpts);
applyEventHandlers(secureClient, 'Hello, I am a secure client');