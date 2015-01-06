'use strict';

var
  shell = require('shelljs'),
  _ = require('lodash');

function Fetcher(exclusions) {
  this._exclusions = exclusions;
}

Fetcher.prototype.get = function() {
  var shellStdOut = shell.exec('npm outdated --json --depth=0 --parseable=true', {silent: true}).output,
      outdated = JSON.parse(
        (shellStdOut.length > 0) ? shellStdOut : '{}'
      ),
      parsedOutdated = {};

  _.each(outdated, function(dependency, packageName) {
    if (!_.contains(this._exclusions, packageName)) {
      parsedOutdated[packageName] = {
        current: dependency.current,
        latest: dependency.latest
      };
    }
  }, this);

  return parsedOutdated;
};

module.exports = Fetcher;
