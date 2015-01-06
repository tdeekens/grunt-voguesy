var expect = require('chai').expect;

var Semver = require('../../tasks/semver/index'),
    semver;

describe('Semver comparator specification', function() {
  beforeEach(function() {
    semver = new Semver();
    semver.setComparison('1.2.3', '4.5.6');
  });

  it('it parses valid semver strings', function() {
    expect(semver.valid()).to.be.true;
  });

  it('it fails on invalid semver strings', function() {
    semver = new Semver();
    semver.setComparison().setComparison('1.2.3', '4.5');
    expect(semver.valid()).to.be.false;

    semver = new Semver();
    semver.setComparison('1.2', '4.5.6');
    expect(semver.valid()).to.be.false;

    semver = new Semver();
    semver.setComparison('1.2', '4.5.v6');
    expect(semver.valid()).to.be.false;
  });

  it('it allows to get the major of a semver', function() {
    expect(semver.major().get()).to.equal(1);
    expect(semver.major().is(1)).to.be.true;
  });

  it('it allows to get the minor of a semver', function() {
    expect(semver.minor().get()).to.equal(2);
    expect(semver.minor().is(2)).to.be.true;
  });

  it('it allows to get the patch of a semver', function() {
    expect(semver.patch().get()).to.equal(3);
    expect(semver.patch().is(3)).to.be.true;
  });

  it('it allows to to specify allowed backward ranges on semvers', function() {
    expect(semver.major().behind(3)).to.be.true;
    expect(semver.major().behind(1)).to.be.false;

    expect(semver.minor().behind(3)).to.be.true;
    expect(semver.minor().behind(1)).to.be.false;

    expect(semver.patch().behind(3)).to.be.true;
    expect(semver.patch().behind(1)).to.be.false;
  });

  it('it allows to to specify allowed forward ranges on semvers', function() {
    expect(semver.major().ahead(2)).to.be.false;
    expect(semver.major().ahead(3)).to.be.true;

    expect(semver.minor().ahead(2)).to.be.false;
    expect(semver.minor().ahead(3)).to.be.true;

    expect(semver.patch().ahead(2)).to.be.false;
    expect(semver.patch().ahead(3)).to.be.true;
  });

  it('it evaluates a list of dependencies and their major version', function() {
    semver = new Semver({
      major: 5,
      minor: 5,
      patch: 5
    });

    var packages = {
      mocha: {
        current: '2.0.1',
        latest: '3.1.0'
      },
      voguesy: {
        current: '1.0.1',
        latest: '2.0.0'
      }
    };

    expect(semver.allMajor(packages)).to.be.true;

    semver = new Semver({
      major: 0,
      minor: 0,
      patch: 5
    });

    expect(semver.allMajor(packages)).to.be.false;
  });

  it('it evaluates a list of dependencies and their minor version', function() {
    semver = new Semver({
      major: 1,
      minor: 5,
      patch: 5
    });

    var packages = {
      mocha: {
        current: '2.0.1',
        latest: '2.1.0'
      },
      voguesy: {
        current: '1.0.1',
        latest: '2.0.0'
      }
    };

    expect(semver.allMinor(packages)).to.be.true;

    semver = new Semver({
      major: 1,
      minor: 0,
      patch: 5
    });

    expect(semver.allMinor(packages)).to.be.false;
  });

  it('it evaluates a list of dependencies and their patch version', function() {
    semver = new Semver({
      major: 5,
      minor: 5,
      patch: 0
    });

    var packages = {
      mocha: {
        current: '2.1.0',
        latest: '2.1.1'
      },
      voguesy: {
        current: '2.0.0',
        latest: '2.0.1'
      }
    };

    expect(semver.allPatch(packages)).to.be.false;

    semver = new Semver({
      major: 5,
      minor: 5,
      patch: 2
    });

    expect(semver.allPatch(packages)).to.be.true;
  });
});
