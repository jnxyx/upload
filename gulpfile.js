var gulp = require('gulp');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('minify-js', function() {
	gulp.src('src/upload.js') 
		//合并
		//.pipe(concat('all.js'))
		//压缩
		.pipe(uglify()) 
        .pipe(rename('upload.min.js'))
		//路径
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
	gulp.watch('hello.js', ['minify-js']);
});