/**
 * This script demonstrates a MOWS client connecting to a server over HTTP and HTTPS.
 *
 * It is designed to work with 'secure-test/secure-server.js'. Note the server makes use of self-signed
 * certificates under the domain 'my.webserver.com'. To test this script locally, you will need to make this
 * domain accessible by editing your Hosts file.
 */

var mows = require('../index');
var fs   = require('fs');

/**
 * Simple method to assist in adding events to a client
 */
var applyEventHandlers = function(client)
{
    client.on('connect', function(){
        console.log('Client Connected as ', client.options.clientId);
        client.subscribe('/hiworld');
        client.publish('/hiworld', 'Hello World');
    });

    client.on('error', function(e){
        console.log('Client Error:', e);
    });

    client.on('message', function(topic, message){
        console.log('Client received message:', topic, message);
        client.end();
    });
};

/**
 * Example #1 - connect to a unsecure MOWS server
 */
var unsecureClient1 = mows.createClient(665, 'ws://my.webserver.com');
applyEventHandlers(unsecureClient1);


/**
 * Example #2 - connect to a secure MOWS server
 *
 * When creating a client in Node, use the 'protocol' property to pass additional
 * configuration paramaters to pass to the HTTPS request.
 * See http://nodejs.org/api/https.html#https_https_request_options_callback
 */
var secureClientOpts =
{
    protocol:
    {
        ca: fs.readFileSync('./secure-test/cert/24485013-my.webserver.com.cert')
    }
};

var unsecureClient2 = mows.createClient(666, 'wss://my.webserver.com', secureClientOpts);
applyEventHandlers(unsecureClient2);