'use strict';

var shell = require('shelljs');
var fs = require('fs');
var _ = require('lodash');

function Fetcher(exclusions) {
  this._exclusions = exclusions;
}

Fetcher.prototype.get = function(onSuccess) {
  var self = this;

  if (fs.existsSync('./bower.json')) {
    var child = shell.exec('bower list --json', {
      async: true,
        silent: true
    });
    var shellData = '';

    child.stdout.on('data', function(data) {
      shellData += data;
    });

    child.stdout.on('end', function() {
      var jsonOutdated = JSON.parse(shellData);
      var parsedOutdated = {};

      _.forEach(jsonOutdated.dependencies, function(dependency, packageName) {
        if (dependency.update !== undefined && !_.includes(self._exclusions, packageName)) {
          parsedOutdated[packageName] = {
            current: dependency.pkgMeta.version,
            latest: dependency.update.latest
          };
        }
      });

      onSuccess(parsedOutdated);
    });
  } else {
    onSuccess(null);
  }
};

module.exports = Fetcher;
