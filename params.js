var URL = require('url');

module.exports = function getParams(port, host, opts) {

  var url = {};
  var parsed = null;
  var result = '';
  var same = false;

  if ('object' === typeof port) {
    opts = port;
    host = null;
    port = null;
  } else if ('string' === typeof port) {
    host = port;
    port = null;
    opts = host;
  }

  if ('object' === typeof host) {
    opts = host;
    host = null;
  }

  if (!host && !port && process.title === 'browser') {
    host = document.URL;
    same = true;
  }

  url.host = host || 'localhost';
  url.port = port;
  url.protocol = 'ws://';

  try{
    parsed = URL.parse(host);
    if (parsed.host) {
      url.host = parsed.hostname;
      url.port = parsed.port || port;
      url.pathname = !same && parsed.pathname || '/mqtt';
      url.protocol = (parsed.protocol === 'https:') ? 'wss://' : 'ws://';
      url.protocol = (parsed.protocol === 'wss:') ? 'wss://' : 'ws://';
    }
  } catch(e) {
  }

  if ('object' !== typeof opts) {
    opts = {};
  }

  var websocketOpts = {
    type: Uint8Array
  };

  if (opts.protocol) {
    websocketOpts.protocol = opts.protocol;
  }

  result = url.protocol + url.host

  if (url.port) {
    result += ':' + url.port
  }

  if (url.pathname) {
     result += url.pathname
  }

  return {
    url: result,
    opts: opts,
    websocketOpts: websocketOpts
  }
};
