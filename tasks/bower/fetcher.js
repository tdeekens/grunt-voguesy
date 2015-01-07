'use strict';

var shell = require('shelljs'),
    fs = require('fs'),
    _ = require('lodash');

function Fetcher(exclusions) {
  this._exclusions = exclusions;
}

Fetcher.prototype.get = function(onSuccess) {
  var _this = this;

  if (fs.existsSync('./bower.json')) {
    var
      child = shell.exec('bower list --json', {
        async: true,
        silent: true
      }),
      shellData = '';

    child.stdout.on('data', function(data) {
      shellData += data;
    });

    child.stdout.on('end', function() {
      var jsonOutdated = JSON.parse(shellData),
          parsedOutdated = {};

      _.each(jsonOutdated.dependencies, function(dependency, packageName) {
        if (dependency.update !== undefined && !_.contains(this._exclusions, packageName)) {
          parsedOutdated[packageName] = {
            current: dependency.pkgMeta.version,
            latest: dependency.update.latest
          };
        }
      }, _this);

      onSuccess(parsedOutdated);
    });
  } else {
    onSuccess(null);
  }
};

module.exports = Fetcher;
