module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      js: {
        src: ['ts_out/src/common.js'],
        dest: 'dist/js/everything.js',
      },
    },
    postcss: {
      options: {
        map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: 'dist/css/maps/' // ...to the specified directory
        },
        processors: [
          require('autoprefixer')(), // add vendor prefixes
          require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: 'css/game.css',
        dest: 'dist/css/everything.min.css',
      }
    },
    uglify: {
      options: {
        sourceMap: true,
      },
      my_target: {
        files: {
          'dist/js/everything.min.js': ['dist/js/everything.js']
        }
      }
    },
    processhtml: {
      dist: {
        files: {
          'dist/index.min.html': ['index.html']
        }
      }
    },
    manifest: {
      generate: {
        options: {
          basePath: '.',
          cache: [
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.min.js',
            'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
            'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.woff',
            'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.ttf',
            'js/everything.min.js',
            'css/everything.min.css',
            'imgs/HelpSlide1.png',
            'imgs/HelpSlide2.png',
            'imgs/HelpSlide3.png',
            'imgs/HelpSlide4.png',
            'imgs/stone-0.png',
            'imgs/board-hori.png',
            'imgs/store-hori.png',
            'imgs/house-hori.png'
          ],
          network: [
            'js/everything.min.js.map',
            'js/everything.js'
          ],
          timestamp: true
        },
        dest: 'dist/index.min.appcache',
        src: []
      }
    },
    'http-server': {
        'dev': {
            // the server root directory
            root: '.',
            port: 9000,
            host: "0.0.0.0",
            cache: 1,
            showDir : true,
            autoIndex: true,
            // server default file extension
            ext: "html",
            // run in parallel with other tasks
            runInBackground: true
        }
    },
    protractor: {
      options: {
        configFile: "protractor.conf.js", // Default config file
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      all: {}
    },
  });

  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', [
      'karma',
    //  'copy',
      'concat', 'postcss', 'uglify',
      'processhtml', 'manifest' ]);
    //  'http-server', 'protractor']);

};
