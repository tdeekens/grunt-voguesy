'use strict';

var shell = require('shelljs');

function Fetcher() {
}

Fetcher.prototype.get = function() {
  var shellStdOut = shell.exec('npm outdated --json --depth=0 --parseable=true', {silent: true}).output,
      outdated = JSON.parse(
        (shellStdOut.length > 0) ? shellStdOut : '{}'
      );

  return outdated;
};

module.exports = Fetcher;
