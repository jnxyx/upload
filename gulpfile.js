var gulp = require('gulp');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');

//压缩js文件
gulp.task('minify-js', function() {
	gulp.src('src/myUpload.js') // 要压缩的js文件
		//.pipe(concat('all.js'))
		.pipe(uglify()) //使用uglify进行压缩
        .pipe(rename('myUpload.min.js'))
		.pipe(gulp.dest('dest')); //压缩后的路径
});

//指定入口的任务
gulp.task('entrance', ['minify-js', 'watch'], function() {
	console.log('the gulp entrance.');
	console.log("task start");
});

//默认的任务
gulp.task('default', ['minify-js', 'watch'], function() {
	console.log('the gulp entrance.');
	console.log("task start");
});

//监控源文件，动态更新
gulp.task('watch', function() {
	gulp.watch('hello.js', ['minify-js']);
});