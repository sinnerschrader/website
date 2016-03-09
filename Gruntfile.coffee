module.exports = (grunt) ->

  grunt.initConfig
    pkg:
      distPath           : 'dist/'
      staticBasePath     : 'static/'
      cssBasePath        : '<%= pkg.staticBasePath %>css/'
      jsBasePath         : '<%= pkg.staticBasePath %>js/'
      imageBasePath      : '<%= pkg.staticBasePath %>images/'
      jsExtPath          : '<%= pkg.jsBasePath %>ext/'
      jsModPath          : '<%= pkg.jsBasePath %>modules/'

    smaller:
      options:
        'host'      : 'sr.s2.de'
        'processor' : 'coffeeScript,merge,closure,uglifyjs,lessjs,yuiCompressor,cssembed'
        'in'        : 'js/app.json,css/app.less'
        'out'       : 'js/app-min.js,css/app-base64-min.css'
        'target'    : '<%= pkg.staticBasePath %>'
      dist:
        files: [
          expand: true,
          cwd: 'static/'
          src: [
            'js/**',
            'css/*.less',
            'images/**',
            '!js/*-min.js'
          ]
        ]

    modernizr:
      build:
        devFile: '<%= pkg.jsExtPath %>modernizr-2.7.1.js'
        outputFile: '<%= pkg.jsExtPath %>modernizr.custom.js'
        extra:
          shiv: false
          printshiv: false
          load: false
          mq: false
          cssclasses: true
        extensibility:
          addtest: true
          prefixed: false
          teststyles: true
          testprops: true
          testallprops: true
          hasevents: false
          prefixes: true
          domprefixes: true
        uglify: false
        #Define any tests you want to implicitly include.
        tests: []
        parseFiles: true
        files:
          src: [
            '<%= pkg.cssBasePath %>*.less'
            '!<%= pkg.cssBasePath %>_*.less'
            '<%= pkg.jsModPath %>**/*.{coffee,js}'
          ]
        matchCommunityTests: false
        customTests: []

    browserify:
      options:
        browserifyOptions:
          extensions: [
            '.js',
            '.json',
            '.coffee'
          ]
        transform: ['coffeeify']

      app:
        files: [
          src: './src/js/app.coffee',
          dest: './static/js/app.js'
        ]


  grunt.loadNpmTasks 'grunt-smaller'
  grunt.loadNpmTasks 'grunt-modernizr'

  grunt.registerTask 'build', [
    'smaller:dist'
  ]

  grunt.registerTask 'default', 'Info screen', ->
    grunt.log.subhead '### available grunt tasks:\n'
    grunt.log.writeln 'grunt build                  main task for building minified files of JS and CSS'
    grunt.log.writeln 'grunt modernizr              main task for building custom modernizr'
