'use strict';

var _ = require('lodash');

function Semver(tolerance) {
  this._tolerance = tolerance;
}

Semver.prototype.setComparison = function(base, comparator) {
  this._base = this.parse(base);
  this._comparator = this.parse(comparator);

  return this;
};

Semver.prototype.allMajor = function(status, comparator) {
  var _comparator = comparator || 'latest';
  var _outdated = {};
  var self = this;

  _.forEach(status, function(version, packageName) {
    self.setComparison(version.current, version.latest);

    if (!self.major().ahead(self._tolerance.major)) {
      _outdated[packageName] = version;
    }
  });

  return {
    passing: Object.keys(_outdated).length <= 0,
    outdated: _outdated
  };
};

Semver.prototype.allMinor = function(status, comparator) {
  var _comparator = comparator || 'latest';
  var _outdated = {};
  var self = this;

  _.forEach(status, function(version, packageName) {
    self.setComparison(version.current, version.latest);

    if (!self.minor().ahead(self._tolerance.minor)) {
      _outdated[packageName] = version;
    }
  });

  return {
    passing: Object.keys(_outdated).length <= 0,
    outdated: _outdated
  };
};

Semver.prototype.allPatch = function(status, comparator) {
  var _comparator = comparator || 'latest';
  var _outdated = {};
  var self = this;

  _.forEach(status, function(version, packageName) {
    self.setComparison(version.current, version.latest);

    if (!self.patch().ahead(self._tolerance.patch)) {
      _outdated[packageName] = version;
    }
  });

  return {
    passing: Object.keys(_outdated).length <= 0,
    outdated: _outdated
  };
};

Semver.prototype.generate = function(part) {
  var api = {
    get: function() {
      return this._base[part];
    },
    is: function(minor) {
      return minor === this._base[part];
    },
    behind: function(range) {
      var _tolerance = this._comparator[part] - range;

      return this._base[part] >= _tolerance;
    },
    ahead: function(range) {
      var _tolerance = this._base[part] + range;

      return _tolerance >= this._comparator[part];
    }
  };

  return {
    get: api.get.bind(this),
    is: api.is.bind(this),
    behind: api.behind.bind(this),
    ahead: api.ahead.bind(this)
  };
};

Semver.prototype.parse = function(version) {
  if (typeof version !== 'string') { return false; }

  var _split = version.split('.');
  var _parsed;

  if (_split.length !== 3) { return false; }

  _parsed = {
    major: parseInt(_split[0]),
    minor: parseInt(_split[1]),
    patch: parseInt(_split[2])
  };

  return (
    isNaN(_parsed.major) ||
    isNaN(_parsed.minor) ||
    isNaN(_parsed.patch)
  ) ? false : _parsed;
};

Semver.prototype.valid = function() {
  return (
    this._base !== false &&
    this._comparator !== false
  );
};

Semver.prototype.major = function() {
  return this.generate('major');
};

Semver.prototype.minor = function() {
  return this.generate('minor');
};

Semver.prototype.patch = function() {
  return this.generate('patch');
};

module.exports = Semver;
