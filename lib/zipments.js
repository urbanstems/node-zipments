var ZipmentsResource = require('./ZipmentsResource');

Zipments.DEFAULT_HOST = 'api.zipments.com';
Zipments.DEFAULT_PORT = '443';
Zipments.DEFAULT_BASE_PATH = '/v1/';
Zipments.DEFAULT_TIMEOUT = require('http').createServer().timeout;

function Zipments(key, live){
  live = (live === undefined) ? true : live;

  if (!(this instanceof Zipments)) {
    return new Zipments(key);
  }

  this._api = {
    auth: null,
    live: live,
    host: Zipments.DEFAULT_HOST,
    port: Zipments.DEFAULT_PORT,
    basePath: Zipments.DEFAULT_BASE_PATH,
    timeout: Zipments.DEFAULT_TIMEOUT,
    dev: false
  };

  this._prepResources();
  this.setApiKey(key);
}


Zipments.prototype = {

  getApiField: function(key) {
    return this._api[key];
  },

  setApiKey: function(key) {
    if (key){
      this._setApiField('auth', key);
    }
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },
  
  _prepResources: function() {
    this.jobs = new ZipmentsResource(this);
  }

};

module.exports = Zipments;
