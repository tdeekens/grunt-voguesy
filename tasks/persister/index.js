'use strict';

var fs = require('fs');

function Persister(location) {
  this._location = location;
}

Persister.prototype.persist = function(stats) {
  var written = null;

  written = this.write(stats);

  return written;
};

Persister.prototype.write = function(data) {
  var json = JSON.stringify(data, null, 2);

  fs.writeFileSync(this._location, json);

  return data;
};

Persister.prototype.read = function() {
  var json = null;

  if (fs.existsSync(this._location)) {
    json = fs.readFileSync(this._location);

    json = JSON.parse(json);
  }

  return json;
};

module.exports = Persister;
