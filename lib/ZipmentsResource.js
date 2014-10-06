var utils = require('./utils');
var http = require('http');
var https = require('https');
var path = require('path');
var when = require('when');

function ZipmentsResource(zipments) {

  this._zipments = zipments;
  this.basePath = utils.makeURLInterpolator(zipments.getApiField('basePath'));
}

ZipmentsResource.prototype = {
  
  path: 'customer/jobs',

  initialize: function() {},

  createFullPath: function(commandPath, urlData) {
    return path.join(
      this.basePath(urlData),
      this.path,
      typeof commandPath == 'function' ?
        commandPath(urlData) : commandPath
    ).replace(/\\/g, '/'); // ugly workaround for Windows
  },

  create: function (data) {
    var self = this;
    var args = [].slice.call(arguments);

    var callback = typeof args[args.length - 1] == 'function' && args.pop();
    var deferred = this.createDeferred(callback);

    this._request('POST', this.path, data, null, function(err, response) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(response);
      }
    });

    return deferred.promise;
  },

  createDeferred: function(callback) {
      var deferred = when.defer();

      if (callback) {
        // Callback, if provided, is a simply translated to Promise'esque:
        // (Ensure callback is called outside of promise stack)
        deferred.promise.then(function(res) {
          setTimeout(function(){ callback(null, res) }, 0);
        }, function(err) {
          setTimeout(function(){ callback(err, null); }, 0);
        });
      }

      return deferred;
  },
    
  _request: function(method, path, data, auth, callback) {

    var requestData = utils.stringifyRequestData(data || {});
    var self = this;

    // var apiVersion = this._zipments.getApiField('version');
    var headers = {
      'Authorization': 'Bearer ' + this._zipments.getApiKey('auth'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // if (apiVersion) {
    //   headers['Stripe-Version'] = apiVersion;
    // }

    // make the request!
    makeRequest();
    

    function makeRequest() {

      var timeout = self._zipments.getApiField('timeout');
      // var isInsecureConnection = self._zipments.getApiField('protocol') == 'http';

      var req = (https
      ).request({
        host: self._zipments.getApiField('host'),
        port: self._zipments.getApiField('port'),
        path: path,
        method: method,
        headers: headers,
        ciphers: "DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5"
      });

      req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
      req.on('response', self._responseHandler(req, callback));
      req.on('error', self._errorHandler(req, callback));

      req.on('socket', function(socket) {
        socket.on('secureConnect', function() {
          // Send payload; we're safe:
          req.write(requestData);
          req.end();
        });
      });

    }
  }

};