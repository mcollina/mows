

var mows = require('../index'),
    fs = require('fs');

var secureOpts =
{
    key:  fs.readFileSync('./secure-test/cert/24485013-my.webserver.com.key'),
    cert: fs.readFileSync('./secure-test/cert/24485013-my.webserver.com.cert')
}

var clientHandler = function(client){

    var self = this;

    if (!self.clients) self.clients = {};

    client.on('connect', function(packet) {
        console.log('Connect')
        client.connack({returnCode: 0});
        client.id = packet.clientId;
        self.clients[client.id] = client;
    });

    client.on('publish', function(packet) {
        console.log('Publish')
        for (var k in self.clients) {
            self.clients[k].publish({topic: packet.topic, payload: packet.payload});
        }
    });

    client.on('subscribe', function(packet) {
        var granted = [];
        for (var i = 0; i < packet.subscriptions.length; i++) {
            granted.push(packet.subscriptions[i].qos);
        }

        client.suback({granted: granted, messageId: packet.messageId});
    });

    client.on('pingreq', function(packet) {
        client.pingresp();
    });

    client.on('disconnect', function(packet) {
        console.log('disconnect')
        client.stream.end();
    });

    client.on('close', function(err) {
        delete self.clients[client.id];
    });

    client.on('error', function(err) {
        client.stream.end();
        console.log('error!');
    });

}

var unsecureServer = mows.createServer(clientHandler).listen(665);
var secureServer   = mows.createSecureServer(secureOpts, clientHandler).listen(666);

console.log('Listening for MQTT websocket connections on ports 666 (secure) and 665 (unsecure)');

var https = require('https');

https.createServer(secureOpts, function(req, res){

    var file = fs.readFile('./' + req.url, function(err, data){
        if(err)
        {
            res.end("" + err);
        } else
        {
            console.log(data)
            res.end(data);
        }
    });

}).listen(443);
