# Mows - MQTT.js over WebSockets

    npm install mows --save

Tunnel [MQTT](http://mqtt.org) through HTML5
[websockets](https://developer.mozilla.org/en-US/docs/WebSockets) using
node.js Streams, thanks to
[websocket-stream](https://npmjs.org/package/websocket-stream).

Mows is based on [MQTT.js](http://npm.im/mqtt) and it offers the same
high-level API.

## in the Browser

you can use [browserify](http://github.com/substack/node-browserify) to package this module for browser use.

```javascript
var mows   = require('mows')
  , client = mows.createClient();
  // pass an optional 'ws://localhost:port' here.

client.subscribe('presence');
client.publish('presence', 'Hello mqtt');

client.on('message', function (topic, message) {
  console.log(message);

  client.end();
});
```
See [MQTT.js](http://npm.im/mqtt) for the full API.

### browserify steps
```javascript
npm install -g browserify // install browserify
cd node_modules/mows
npm install . // install dev dependencies
browserify browser.js -s mows > mows.js // require mows.js in your client-side app
```

## On Node

```javascript
var mows   = require('mows')
  , client = mows.createClient('ws://localhost:12345');

client.subscribe('presence');
client.publish('presence', 'Hello mqtt');

client.on('message', function (topic, message) {
  console.log(message);

  client.end();
});
```
See [MQTT.js](http://npm.im/mqtt) for the full API.

## Server API

It uses the [`ws`](http://npmjs.org/ws) module to bake an
MQTT-enhaced websocket server:

```js
var mows = require('mows');

var server = mows.createServer(function(client) {
  // just as MQTT.js
});

server.listen(3000);
```

or it can be just used to attach it to an existent http server:
```js

var http = require('http')
  , mows = require('mows')
  , server = http.createServer();
  
mows.attachServer(server, function(client) {
  // just as MQTT.js
});

server.listen(3000);
```

## LICENSE - "MIT License"

Copyright (c) 2013 Matteo Collina (http://matteocollina.com)

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
