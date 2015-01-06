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

  var passing = _.all(status, function(version, packageName) {
    this.setComparison(version.current, version.latest);

    return this.major().ahead(this._tolerance.major);
  }, this);

  return passing;
};

Semver.prototype.allMinor = function(status, comparator) {
  var _comparator = comparator || 'latest';

  var passing = _.all(status, function(version, packageName) {
    this.setComparison(version.current, version.latest);

    return this.minor().ahead(this._tolerance.minor);
  }, this);

  return passing;
};

Semver.prototype.allPatch = function(status, comparator) {
  var _comparator = comparator || 'latest';

  var passing = _.all(status, function(version, packageName) {
    this.setComparison(version.current, version.latest);

    return this.patch().ahead(this._tolerance.patch);
  }, this);

  return passing;
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

  var _split = version.split('.'),
      _parsed;

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
