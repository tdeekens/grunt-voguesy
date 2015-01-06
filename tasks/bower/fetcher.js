'use strict';

var shell = require('shelljs'),
    fs = require('fs'),
    _ = require('lodash');

function Fetcher() {
}

Fetcher.prototype.get = function(onSuccess) {
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
        if (dependency.update !== undefined) {
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
