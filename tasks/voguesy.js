/*
* grunt-voguesy
* https://github.com/tdeekens/grunt-voguesy
*
* Copyright (c) 2014 tdeekens
* Licensed under the MIT license.
*/

'use strict';

module.exports = function(grunt) {
  var
    NpmFetcher = require('./npm/fetcher'),
    BowerFetcher = require('./bower/fetcher'),
    Persister = require('./persister'),
    SemVer = require('./semver'),
    _ = require('lodash');

  grunt.registerTask('voguesy', 'Analyse the up-to-dateness of your dependencies.', function() {
    //Grunt related initialization
    var
      options = this.options({
        awake: 25,
        warn: true,
        store: './dist/voguesy.json',
        'up-to-dateness': {
          major: 0,
          minor: 2,
          patch: 5,
          number: 5
        }
      }),
      done = this.async();

    //Setup helper objects with grunt options passed in
    var
      npmFetcher = new NpmFetcher(),
      bowerFetcher = new BowerFetcher(),
      semver = new SemVer(options['up-to-dateness']),
      persister = new Persister(options.store);

    //Helper function to avoid code repetition
    var
      checkDependencies = function(dependencies) {
        var numberOfOudatedPackages = Object.keys(dependencies || {}).length;

        return (dependencies === null) ? true : (
          options['up-to-dateness'].number >= numberOfOudatedPackages &&
          semver.allMinor(dependencies, 'latest') &&
          semver.allMajor(dependencies, 'latest') &&
          semver.allPatch(dependencies, 'latest`')
        );
      },
      dependenciesAsArray = function(dependencies) {
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
            _.map(_.merge(outdatedNpmPackagesAsArray, outdatedBowerPackagesAsArray), 'package') +
            '.'
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
    var status = persister.read();
    if (status === null) { initializeStatus(); }

    //Do the work
    if (status.since >= options.awake) {
      var outdatedNpmPackages = npmFetcher.get(),
          outdatedBowerPackages = null,
          outdatedNpmPackagesAsArray = null,
          outdatedBowerPackagesAsArray = null;

      status['up-to-date'].npm = checkDependencies(outdatedNpmPackages);

      bowerFetcher.get(function(outdatedPackages) {
        outdatedBowerPackages = outdatedPackages;

        status['up-to-date'].bower = checkDependencies(outdatedBowerPackages);

        status['up-to-date'].all = (
          status['up-to-date'].npm && status['up-to-date'].bower
        );

        outdatedNpmPackagesAsArray = dependenciesAsArray(outdatedNpmPackages);
        outdatedBowerPackagesAsArray = dependenciesAsArray(outdatedBowerPackages);

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
