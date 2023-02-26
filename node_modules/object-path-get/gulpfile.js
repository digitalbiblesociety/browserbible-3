'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodeunit = require('gulp-nodeunit');

gulp.task('jshint', function () {
	gulp.src('*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
	gulp.src('test.js')
		.pipe(nodeunit());
});

gulp.task('watch', function () {
	gulp.watch(['*.js'], ['jshint', 'test']);
});

// setup default task
gulp.task('default', ['jshint', 'test', 'watch']);

// handle errors
process.on('uncaughtException', function (e) {
	console.error(e);
});
