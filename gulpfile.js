var gulp = require('gulp');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var bufferf = require('gulp-buffer');
var streamify = require('gulp-streamify');

gulp.task('minify-js', function() {
	var files = source('src/upload.js');
	console.log(files);

	gulp.src('src/upload.js').on('data',function(file){
		console.log(file.contents);
	});

	gulp.src('src/upload.js') 
		//.pipe(concat('all.js'))
		.pipe(uglify()) 
        .pipe(rename('upload.min.js'))
		.pipe(gulp.dest('dist')); 
});

gulp.task('entrance', ['minify-js', 'watch'], function() {
	console.log('the gulp entrance.');
	console.log("task start");
});


gulp.task('default', ['minify-js', 'watch'], function() {
	console.log('the gulp entrance.');
	console.log("task start");
});

//监控
gulp.task('watch', function() {
	gulp.watch('upload.js', ['minify-js']);
});