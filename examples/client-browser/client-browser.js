/**
 * This script demonstrates a MOWS browser client connecting to a server over HTTP and HTTPS.
 *
 * It relies on the server script located at 'examples/server/server.js'.
 * 
 * Note the server makes use of a self-signed certificate for domain 'my.webserver.com'.
 * To test this script locally, you will need to make this domain accessible by editing
 * your Hosts file. Ie - adding '127.0.0.1 mywebserver.com'.
 */

/**
 * Simple method to assist in adding events to a client
 */
var applyEventHandlers = function(client, msg)
{
    client.on('connect', function(){
        console.log('Client Connected as ', client.options.clientId);
        client.subscribe('/hiworld');
        client.publish('/hiworld', msg);
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
 * Example #1 - connect to an unsecure MOWS server
 */
var unsecureClient = mows.createClient(665, 'ws://my.webserver.com');
applyEventHandlers(unsecureClient, 'Hello, I am a unsecure client');

/**
 * Example #2 - connect to a secure MOWS server
 */
var secureClient = mows.createClient(666, 'wss://my.webserver.com');
applyEventHandlers(secureClient, 'Hello, I am a secure client');