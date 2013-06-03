module.exports = function (grunt) {
  var sourceFiles = [
    // core / anim + tween + dd
    'src/Global.js',
    'src/Util.js',
    'src/Canvas.js',
    'src/Node.js',
    'src/Animation.js',
    'src/Tween.js',
    'src/DragAndDrop.js',
    'src/Container.js',
    'src/Shape.js',
    'src/Stage.js',
    'src/Layer.js',
    'src/Group.js',

    // shapes
    'src/shapes/Rect.js',
    'src/shapes/Circle.js',
    'src/shapes/Wedge.js',
    'src/shapes/Image.js',
    'src/shapes/Polygon.js',
    'src/shapes/Text.js',
    'src/shapes/Line.js',
    'src/shapes/Spline.js',
    'src/shapes/Blob.js',
    'src/shapes/Sprite.js',

    // plugins
    'src/plugins/Path.js',
    'src/plugins/TextPath.js',
    'src/plugins/RegularPolygon.js',
    'src/plugins/Star.js',
    'src/plugins/Label.js',

    // filters
    'src/filters/Grayscale.js',
    'src/filters/Brighten.js',
    'src/filters/Invert.js',
    'src/filters/Blur.js',
    'src/filters/Mask.js'
  ];

  var unitTestFiles = [
    'tests/js/unit/animationTests.js',
    'tests/js/unit/tweenTests.js',
    'tests/js/unit/globalTests.js',
    'tests/js/unit/utilTests.js',
    'tests/js/unit/nodeTests.js',
    'tests/js/unit/stageTests.js',
    'tests/js/unit/containerTests.js',
    'tests/js/unit/layerTests.js',
    'tests/js/unit/shapeTests.js',
    'tests/js/unit/ddTests.js',
    'tests/js/unit/shapes/rectTests.js',
    'tests/js/unit/shapes/circleTests.js',
    'tests/js/unit/shapes/wedgeTests.js',
    'tests/js/unit/shapes/imageTests.js',
    'tests/js/unit/shapes/polygonTests.js',
    'tests/js/unit/shapes/lineTests.js',
    'tests/js/unit/shapes/splineTests.js',
    'tests/js/unit/shapes/blobTests.js',
    'tests/js/unit/shapes/textTests.js',
    'tests/js/unit/shapes/spriteTests.js',
    'tests/js/unit/plugins/pathTests.js',
    'tests/js/unit/plugins/regularPolygonTests.js',
    'tests/js/unit/plugins/starTests.js',
    'tests/js/unit/plugins/textPathTests.js',
    'tests/js/unit/plugins/labelTests.js'
  ];

  // Project configuration.
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      source: {
        src: sourceFiles,
        dest: 'dist/kinetic-v<%= pkg.version %>.js'
      },
      test: {
        src: unitTestFiles,
        dest: 'tests/js/unitTests.js'
      }
    },
    replace: {
      dev: {
        options: {
          variables: {
            version: '<%= pkg.version %>',
            date: '<%= grunt.template.today("yyyy-mm-dd") %>',
            nodeParams: '<%= grunt.file.read("doc-includes/NodeParams.txt") %>',
            containerParams: '<%= grunt.file.read("doc-includes/ContainerParams.txt") %>',
            shapeParams: '<%= grunt.file.read("doc-includes/ShapeParams.txt") %>'
          },
          prefix: '@@'
        },

        files: [{
            src: ['dist/kinetic-v<%= pkg.version %>.js'],
            dest: 'dist/kinetic-v<%= pkg.version %>.js'
          }
        ]
      },
      prod: {
        options: {
          variables: {
            version: '<%= pkg.version %>',
          },
          prefix: '@@'
        },
        files: [{
            src: ['dist/kinetic-Global-v<%= pkg.version %>.min.js'],
            dest: 'dist/kinetic-Global-v<%= pkg.version %>.min.js'
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/\n'
      },
      build: {
        files: {
          'dist/kinetic-v<%= pkg.version %>.min.js': 'dist/kinetic-v<%= pkg.version %>.js'
        }
      }
    },
    clean: {
      build: ['dist/*']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      beforeconcat: ['src/**/*.js'],
      afterconcat: ['dist/kinetic-v<%= pkg.version %>.js']
    }
  };

  for (var n = 0; n < sourceFiles.length; n++) {
    var inputFile = sourceFiles[n];
    var className = (inputFile.match(/[-_\w]+[.][\w]+$/i)[0]).replace('.js', '');
    var outputFile = 'dist/kinetic-' + className + '-v<%= pkg.version %>.min.js';

    config.uglify.build.files[outputFile] = [inputFile];
  }

  grunt.initConfig(config);

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Tasks
  grunt.registerTask('dev', ['clean', 'concat:source', 'replace:dev']);
  grunt.registerTask('full', ['clean', 'concat:source', 'replace:dev', 'uglify', 'replace:prod']);
  grunt.registerTask('test', ['concat:test']);
  grunt.registerTask('hint', ['clean', 'concat:source', 'replace:dev', 'jshint']);
};