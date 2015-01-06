'use strict';

var shell = require('shelljs');

function Fetcher() {
}

Fetcher.prototype.get = function() {
  var outdated = JSON.parse(
    shell.exec('npm outdated --json --depth=0 --parseable=true', {silent: true}).output
  );

  return outdated;
};

module.exports = Fetcher;
