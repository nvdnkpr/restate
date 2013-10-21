module.exports = function(grunt) {
	require('time-grunt')(grunt);

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['dist'],
		copy: {
			pre: {
				files: [
					{expand: true, flatten: true, src: ['node_modules/async/lib/async.js'], dest: 'web/js/lib/'},
					{expand: true, flatten: true, src: ['node_modules/underscore/underscore.js'], dest: 'web/js/lib/'},
-ko-				
					{expand: true, flatten: true, src: ['node_modules/funcsync/funcsync.min.js'], dest: 'web/js/lib/'},
					{expand: true, flatten: true, src: ['node_modules/vindication.js/vindication.min.js'], dest: 'web/js/lib/'},
					{expand: true, flatten: true, src: ['node_modules/knockout/build/output/knockout-latest.js'], dest: 'web/js/lib/'},
					{expand: true, flatten: true, src: ['node_modules/knockout-parsley/knockout.parsley.min.js'], dest: 'web/js/lib/'},
					{expand: true, flatten: true, src: ['node_modules/knockout.mapper.js/knockout.mapper.min.js'], dest: 'web/js/lib/'},
-eoko-
				]
			},
			main: {
				files: [
					{expand: true, src: ['www/**'], dest: 'dist/', filter: 'isFile'}
				]
			}
		},
		jshint: {
			options: {
			},
			all: [ 'server/*.js', 'web/js/*.js' ]
		},
		uglify: {
			development: {
				options: {
					mangle: false,
					beautify: true
				},
				files: {
					'www/js/viesa.all.min.js': [
						'web/js/lib/underscore.js','web/js/lib/vindication.min.js', 'web/js/lib/funcsync.js', 'web/js/lib/async.js',
						'web/js/lib/jquery-2.0.3.min.js',
						'web/js/lib/knockout-latest.js', 'web/js/lib/knockout.mapper.min.js', 'web/js/lib/knockout.parsley.min.js',
						'web/js/*.js'
					]
				}
			},
			production: {
				options: {
					mangle: false,
					beautify: false
				},
				files: {
					'www/js/viesa.all.min.js': [
						'web/js/lib/underscore.js','web/js/lib/vindication.min.js', 'web/js/lib/funcsync.js', 'web/js/lib/async.js',
						'web/js/lib/jquery-2.0.3.min.js',
						'web/js/lib/knockout-latest.js', 'web/js/lib/knockout.mapper.min.js', 'web/js/lib/knockout.parsley.min.js',
						'web/js/*.js'
					]
				}
			}
		},
		jade: {
			development: {
				options: {
					pretty: true,
					data: {
						debug: true
					}
				},
				files: {
					"www/index.html": [ 'web/views/index.jade' ]
				}
			},
			production: {
				options: {
					pretty: false,
					data: {
						debug: false
					}
				},
				files: {
					"www/index.html": [ 'web/views/index.jade' ]
				}
			}
		},
		less: {
			development: {
				files: {
					"www/css/styles.css": "web/less/styles.less"
				}
			},
			production: {
				options: {
					yuicompress: true
				},
				files: {
					"www/css/styles.css": "web/less/styles.less"
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'www/css/viesa.all.min.css': [
						'web/css/*.css'
					]
				}
			}
		},
		nodeunit: {
			tests: [ 'test/services.js' ]
		}
	});

	grunt.registerTask('test', ['nodeunit']);

	grunt.registerTask('deploy', 'A sample task that logs stuff.', function(stage) {
		grunt.option('force', true);
		grunt.task.run( [
			'clean', 'jshint',
			'copy:pre',
			(stage && stage==='production' ?'jade:production' : 'jade:development'),
			(stage && stage==='production' ?'less:production' : 'less:development'),
			(stage && stage==='production' ?'uglify:production' : 'uglify:development'),
			'cssmin',
			'copy:main'
		] );
	});
	grunt.registerTask('default', 'Default', function(platform) {
		grunt.log.writeln('Use deploy task. Usage: \n grunt deploy:[production|development]');
	});

};