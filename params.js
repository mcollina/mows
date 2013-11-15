
module.exports = function getParams(port, host, opts) {

  var url = null;

  if ('object' === typeof port) {
    opts = port;
    url = 'localhost';
  } else if ('string' === typeof port) {
    url = port;
  }

  if ('object' === typeof host) {
    opts = host;
  } else if ('object' !== typeof opts) {
    opts = {};
  }

  if (!host) {
    host = 'localhost'
  }

  if (!url && host && port) {
    url = host + ':' + port;
  }

  if (url.slice(0,5).toLowerCase() != "ws://" && url.slice(0,6).toLowerCase() != "wss://") {
    url = "ws://" + url;
  }

  var websocketOpts = {
    type: Uint8Array
  };

  if (opts.protocol) {
    websocketOpts.protocol = opts.protocol;
  }

  return {
    url: url,
    opts: opts,
    websocketOpts: websocketOpts
  }
};
