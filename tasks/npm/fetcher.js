'use strict';

var shell = require('shelljs');
var _ = require('lodash');

function Fetcher(exclusions) {
  this._exclusions = exclusions;
}

Fetcher.prototype.get = function() {
  var shellStdOut = shell.exec('npm outdated --json --depth=0 --parseable=true', {silent: true}).output,
      outdated = JSON.parse(
        (shellStdOut.length > 0) ? shellStdOut : '{}'
      ),
      parsedOutdated = {};
  var self = this;

  _.forEach(outdated, function(dependency, packageName) {
    if (!_.contains(self._exclusions, packageName)) {
      parsedOutdated[packageName] = {
        current: dependency.current,
        latest: dependency.latest
      };
    }
  });

  return parsedOutdated;
};

module.exports = Fetcher;
