# grunt-voguesy

**Note: This grunt plugin is under current development and not ready for use just now!**

> A grunt task to analyse the up-to-dateness of your dependencies.

[![NPM](https://nodei.co/npm/grunt-voguesy.png?mini=true)](https://nodei.co/npm/grunt-voguesy/)

[![Build Status](https://travis-ci.org/tdeekens/grunt-voguesy.svg?branch=master)](https://travis-ci.org/tdeekens/grunt-voguesy)
[![Coverage Status](https://coveralls.io/repos/tdeekens/grunt-voguesy/badge.png)](https://coveralls.io/r/tdeekens/grunt-voguesy)
[![Dependency Status](https://david-dm.org/tdeekens/grunt-voguesy.svg?style=flat)](https://david-dm.org/tdeekens/grunt-voguesy)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-voguesy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-voguesy');
```

## Development Roadmap
Not everything has to be in a 0.1.0 - consider it an idea of bold ideas.

- ~~Gather dependency status for `bower` and `npm`~~
  - ~~`npm outdated --json --parseable`~~
  - ~~`bower list`~~
- ~~Allow to specify amount of outdated dependencies and a semver range~~
  - ~~`pass: 5` would imply allowing to pass with 5 deps~~
  - ~~`semver: 'major|minor|path'` to match the semver range~~
  - ~~Maybe allow config per semver range~~
- ~~Properly print the outdated versions~~
- ~~Run task after e.g. every `run: 5` builds cause things take time to fetch~~
- ~~Option to `warn: true` or break build otherwise (grunt fail)~~
- ~~Write into e.g. `dist: '/dist/voguesy.json'` the current status of your dependencies~~
  - ~~as well as the run-count since last check~~
- Add credits file to map to `git author` with highscore to `voguesy.json`

## The "voguesy" task

### Overview
In your project's Gruntfile, the `voguesy` task is available to use.

You can run `grunt voguesy` standalone
Or add it to an existing task: `grunt.registerTask('test', ['clean', 'voguesy']);`

### Options

**TBD**

```javascript
{
  //Run task after n number of grunt runs
  awake: <25>,
  //Save intermediate information in this file
  store: <'./dist/voguesy.json'>,
  //If true only warns, does not break build
  warn: <true>,
  //Information about how up-to-date the libraries should be
  //the allowed threshold for your project
  'up-to-dateness': {
    major: <0>,
    minor: <2>,
    patch: <5>,
    //Limit of outdated libs, no matter what semver increment
    number: <5>
  },

}
```

An example configuration can be found [here](https://github.com/tdeekens/grunt-voguesy/blob/master/grunt/tasks/voguesy.js) and if you want to check the options you might want to check the [Gruntfile](https://github.com/tdeekens/grunt-voguesy/blob/master/tasks/voguesy.js) itself.

## Developing & Contributing

Developing on the task alone is fairly easy just `git clone https://github.com/tdeekens/grunt-voguesy.git` then `cd grunt-voguesy`. From there one has to link the package to itself via `npm link && npm link grunt-voguesy` which will allow for calling `grunt dev`. Now just work the `task/voguesy.js` and check results - feel free to submit a pull-request!

## Release History
- 0.0.0 Development version without release
- 0.1.0 Initial release of mvp feature set
- 0.1.1 Fix shelljs dependency
- 0.1.2 Add lodash as dependency
