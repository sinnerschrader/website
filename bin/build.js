#!/usr/bin/env node

var fs           = require('fs');
var path         = require('path');
var config       = require('../config');
var jsCompiler   = require('../lib/js-compiler');
var cssCompiler  = require('../lib/css-compiler');

var JS_BUILD_DIR =  path.join(__dirname, '../static/js');
var CSS_BUILD_DIR = path.join(__dirname, '../static/css');

function mkdir(path, done) {
  fs.mkdir(path, function(err) {
    if (err && err.code !== 'EEXIST') {
      throw err;
    }

    done();
  });
}

function mkdirRecursive(dir, done) {
  var parts = dir.split('/');
  var progress = [];

  progress.push(parts.shift()); // push '', which represents the leading '/'

  var _mkdirRecursive = function(path) {
    if (!parts.length) {
      return done();
    }

    progress.push(parts.shift());
    mkdir(progress.join('/'), _mkdirRecursive);
  };
  _mkdirRecursive();
}

jsCompiler.build(path.join(__dirname, '../src/js/app.coffee'), function(err, res) {
  if (err) {
    throw(err);
  }

  mkdirRecursive(JS_BUILD_DIR, function() {
    fs.writeFileSync(path.join(JS_BUILD_DIR, 'app.js'), res);
  });
});


cssCompiler.build(path.join(__dirname, '..', config.css.basedir, config.css.filename), function(err, res) {
  if (err) {
    throw(err);
  }

  mkdirRecursive(CSS_BUILD_DIR, function() {
    fs.writeFileSync(path.join(CSS_BUILD_DIR, 'app.css'), res);
  });
});
