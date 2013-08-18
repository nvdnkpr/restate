module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		jshint: {
			all: [ 'lib/*.js', 'lib/**/*.js' ]
		},
	});

	grunt.registerTask('default', ['jshint']);
};