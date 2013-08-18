module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['dist'],
		copy: {
			main: {
				files: [
					{expand: true, src: ['www/**'], dest: 'dist/', filter: 'isFile'}
				]
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					'dist/www/js/lib/underscore.min.js': ['node_modules/underscore/underscore.js']
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
					"www/index.html": [ 'views/index.jade' ]
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
					"www/index.html": [ 'views/index.jade' ]
				}
			}
		},
		less: {
			development: {
				files: {
					"www/css/styles.css": "less/styles.less"
				}
			},
			production: {
				options: {
					yuicompress: true
				},
				files: {
					"www/css/styles.css": "less/styles.less"
				}
			}
		}
	});

	grunt.registerTask('deploy', 'A sample task that logs stuff.', function(stage) {
		grunt.task.run( ['clean', (stage && stage==='production' ?'jade:production' : 'jade:development'), (stage && stage==='production' ?'less:production' : 'less:development'), 'uglify', 'copy'] );
	});
	grunt.registerTask('default', 'Default', function(platform) {
		grunt.log.writeln('Use deploy task. Usage: \n grunt deploy:[production|development]');
	});

};