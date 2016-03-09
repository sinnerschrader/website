var browserify = require('browserify');
var watchify   = require('watchify');
var uglify     = require('uglify-js');

function b(src, debug) {
  return browserify({
      extensions: ['.js', '.json', '.coffee'],
      debug: debug,
      cache: {},
      packageCache: {},
      fullPaths: true
    })
    .add(src)
    .transform('coffeeify');
}

module.exports.build = function(src, done) {
  b(src, false).bundle(function(err, res) {
    if (err) {
      return done(err, null);
    }

    done(null, uglify.minify(res.toString(), {fromString: true}).code);
  });
};

module.exports.middleware = function(src, debug) {
  var w = watchify(b(src, debug));

  return function(req, res, next) {
    w.bundle(function(err, bundle) {
      if (err) {
        return res
          .status(500)
          .send(err);
      }

      res
        .set('content-type', 'application/json')
        .set('content-length', bundle.length)
        .send(bundle);
    });
  };
};
