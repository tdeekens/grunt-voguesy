/*
* grunt-voguesy
* https://github.com/tdeekens/grunt-voguesy
*
* Copyright (c) 2016 tdeekens
* Licensed under the MIT license.
*/

'use strict';

module.exports = function(grunt) {
  var NpmFetcher = require('./npm/fetcher');
  var BowerFetcher = require('./bower/fetcher');
  var Persister = require('./persister');
  var SemVer = require('./semver');
  var _ = require('lodash');

  grunt.registerTask('voguesy', 'Analyse the up-to-dateness of your dependencies.', function() {
    //Grunt related initialization
    var options = this.options({
        awake: 25,
        warn: true,
        store: './dist/voguesy.json',
        'up-to-dateness': {
          major: 0,
          minor: 2,
          patch: 5,
          number: 5
        },
        exclusions: []
      });
    var done = this.async();

    //Setup helper objects with grunt options passed in
    var npmFetcher = new NpmFetcher(options.exclusions);
    var bowerFetcher = new BowerFetcher(options.exclusions);
    var semver = new SemVer(options['up-to-dateness']);
    var persister = new Persister(options.store);

    var status;
    var outdatedNpmPackagesAsArray;
    var outdatedBowerPackagesAsArray;

    //Helper function to avoid code repetition
    var checkDependencies = function(dependencies) {
        var _dependencies = dependencies || {};
        var _numberOfOudatedPackages = Object.keys(_dependencies).length;
        var _minor = semver.allMinor(dependencies, 'latest');
        var _major = semver.allMajor(dependencies, 'latest');
        var _patch = semver.allPatch(dependencies, 'latest`');
        var _passing = (
          options['up-to-dateness'].number >= _numberOfOudatedPackages &&
          _major.passing === true &&
          _minor.passing === true &&
          _patch.passing === true
        );

        return {
          passing: _passing,
          outdated: _.merge(_major.outdated, _minor.outdated, _patch.outdated)
        };
      };

    var dependenciesAsArray = function(dependencies) {
      return _.map(dependencies, function(dependency, packageName) {
        return {
          'package': packageName,
          current: dependency.current,
          latest: dependency.latest,
        };
      });
    },
    initializeStatus = function() {
      options.since = 0;
      options['up-to-date'] = {};
      status = persister.write(options);
    },
    logStatus = function() {
      if (status.since >= options.awake && status['up-to-date'].all === false) {
        grunt.log.errorlns(
          'Dependencies are not passing your demanded up-to-dateness: ' +
          _.map(
            _.merge(
              _.clone(outdatedNpmPackagesAsArray),
              _.clone(outdatedBowerPackagesAsArray)
            ), 'package'
          ) + '.'
        );

        persister.write(status);

        if (options.warn === false) {
          grunt.fail.warn('...breaking build as a result thereof!');
        }
      } else if (status.since >= options.awake && status['up-to-date'].all === true) {
        grunt.log.oklns('Dependencies analyzed and passing your requirements.');

        status.since = 0;
        persister.write(status);
      } else {
        grunt.log.oklns('Dependencies won\'t be analyzed as not enough grunt runs passed.');

        status.since = status.since || 0;
        status.since++;

        status = persister.write(status);
      }
    };

    //Read status from disc or initialize it
    status = persister.read();
    if (status === null) { initializeStatus(); }

    //Do the work
    if (status.since >= options.awake) {
      var outdatedNpmPackages = checkDependencies(npmFetcher.get());
      var outdatedBowerPackages = null;

      status['up-to-date'].npm = outdatedNpmPackages.passing;

      bowerFetcher.get(function(outdatedPackages) {
        outdatedBowerPackages = checkDependencies(outdatedBowerPackages);

        status['up-to-date'].bower = outdatedBowerPackages.passing;

        status['up-to-date'].all = (
          status['up-to-date'].npm && status['up-to-date'].bower
        );

        outdatedNpmPackagesAsArray = dependenciesAsArray(outdatedNpmPackages.outdated);
        outdatedBowerPackagesAsArray = dependenciesAsArray(outdatedBowerPackages.outdated);

        status['up-to-date'].outdated = {};
        status['up-to-date'].outdated.npm = outdatedNpmPackagesAsArray;
        status['up-to-date'].outdated.bower = outdatedBowerPackagesAsArray;

        logStatus();

        done();
      });
    } else {
      logStatus();

      done();
    }
  });
};
