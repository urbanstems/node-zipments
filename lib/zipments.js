var ZipmentsResource = require('./ZipmentsResource');

Zipments.DEFAULT_HOST = 'api.zipments.com';
Zipments.DEFAULT_PORT = '443';
Zipments.DEFAULT_BASE_PATH = '/v1/';
Zipments.DEFAULT_TIMEOUT = require('http').createServer().timeout;

function Zipments(key){

  if (!(this instanceof Zipments)) {
    return new Zipments(key, version);
  }

  this._api = {
    auth: null,
    host: Zipments.DEFAULT_HOST,
    port: Zipments.DEFAULT_PORT,
    basePath: Zipments.DEFAULT_BASE_PATH,
    timeout: Zipments.DEFAULT_TIMEOUT,
    dev: false
  };

  this.setApiKey(key);

}

Zipments.jobs = new ZipmentsResource(this);

Zipments.prototype = {

  getApiField: function(key) {
    return this._api[key];
  },

  setApiKey: function(key) {
    if (key){
      this._setApiField('auth', key);
    }
  },

  _setApiField: function(key) {
    this._api[key] = field;
  }

};



module.exports = Zipments;