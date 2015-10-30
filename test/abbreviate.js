'use strict';

var assert = require('assertive');

var abbreviate = require('../').abbreviate;

describe('abbreviate', function() {
  it('is undefined for an empty list', function() {
    assert.equal(undefined, abbreviate([]));
  });

  it('is the first element for a one element list', function() {
    assert.equal('x', abbreviate([ 'x' ]));
  });

  it('joins multiple hosts with a comma', function() {
    assert.equal('abc,host,xy', abbreviate([ 'abc', 'host', 'xy' ]));
  });

  it('complains about invalid hosts', function() {
    var error;

    error = assert.throws(function() { abbreviate(['']); });
    assert.equal('Invalid host: ""', error.message);

    error = assert.throws(function() { abbreviate(['<foo>']); });
    assert.equal('Invalid host: "<foo>"', error.message);

    error = assert.throws(function() { abbreviate(['abc<']); });
    assert.equal('Invalid host: "abc<"', error.message);
  });

  it('sorts in a predictable order', function() {
    assert.equal('a,bc<1-2>,be', abbreviate([ 'bc1', 'be', 'bc2', 'a' ]));
  });

  it('collapses hosts that only vary by a number', function() {
    assert.equal('host<1,3>-4-u.com', abbreviate([
      'host1-4-u.com',
      'host3-4-u.com',
    ]));
  });

  it('finds consecutive ranges, favoring `-` over `,`', function() {
    assert.equal('host<1,3-6,8-9,11>-4-u.com,other', abbreviate([
      'host11-4-u.com',
      'host1-4-u.com',
      'host6-4-u.com',
      'host8-4-u.com',
      'host3-4-u.com',
      'host4-4-u.com',
      'other',
      'host5-4-u.com',
      'host9-4-u.com',
    ]));
  });

  it('always tries to unify using the first group of digits', function() {
    assert.equal('service4u-app1,service4u-app2,service4u-app3', abbreviate([
      'service4u-app1',
      'service4u-app2',
      'service4u-app3',
    ]));
    assert.equal('service-app<1-3>', abbreviate([
      'service-app1',
      'service-app2',
      'service-app3',
    ]));
  });
});
