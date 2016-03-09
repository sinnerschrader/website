var fs         = require('fs');
var path       = require('path');

function buildLess(src, debug, done) {
  var less       = require('less');
  var Autoprefix = require('less-plugin-autoprefix');
  var CleanCss   = require('less-plugin-clean-css');

  var autoprefix = new Autoprefix({
    // using S2 default Browsermatrix:
    // Desktop
    // - Chrome, Safari, Opera, FIrefox: current and previous
    // - Firefox also last ESR
    // - IE 9 (B-Support)
    // Mobile
    // - Android, iOS, IEMobile: current and previous
    // - Blackberry and stock Android browsers: -
    browsers : ['last 2 versions', 'ie >= 9', 'Firefox ESR', 'ChromeAndroid >= 4.3']
  });

  var cleanCss = new CleanCss({
    advanced : true,
    aggressiveMerging : false,
    restructuring : false,
    keepBreaks : true
  });

  fs.readFile(src, function(err, data) {
    if (err) {
      return done(err, null);
    }

    var opts = {
      paths             : [path.dirname(src)],
      sourceMap         : debug,
      outputSourceFiles : debug,
      ieCompat          : false,
      plugins           : [autoprefix,cleanCss]
    };

    if (!debug) {
      opts.plugins.push(cleanCss);
    }

    less.render(data.toString(), opts)
      .then(function(res) {
        done(null, res.css);
      })
      .catch(function(err) {
        done(err, null);
      });
  });
}

function buildSass(src, debug, done) {
  var sass = require('node-sass');

  sass.render({
    file: src,
    success: function(res) {
      done(null, res.css);
    }
  });
}

function build(src, debug, done) {
  switch (path.extname(src)) {
    case '.less':
      buildLess(src, debug, done);
      break;

    case '.scss':
      buildSass(src, debug, done);
      break;

    default:
      throw new Error('Please use .less or .scss as file extension');
      break;
  }
}

function createErrorCss(err) {
  var content = JSON.stringify('LESS ERROR: ' + err.filename + ':' + err.line + ':' +err.column + ' - ' + err.message);
  return 'body{visibility: hidden;}body::before{content:\'' + content + '\';visibility:visible;color:red;}';
}

module.exports.build = function(src, done) {
  build(src, false, done);
};

module.exports.middleware = function(src, debug) {
  return function(req, res, next) {
    build(src, debug, function(err, css) {
      if (err) {
        return res
          .set('content-type', 'text/css')
          .set('content-length', err.length)
          .status(200)
          .send(createErrorCss(err));
      }

      res
        .set('content-type', 'text/css')
        .set('content-length', css.length)
        .send(css);
    });
  };
};
