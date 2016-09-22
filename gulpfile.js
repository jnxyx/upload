var gulp = require('gulp');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var bufferf = require('gulp-buffer');
var streamify = require('gulp-streamify');
var Stream = require('stream');

var filesArray = [ 
	'upload.description.js' , 
	'upload.main.js' , 
	'upload.tools.js' , 
	'upload.wrapper.js' 
	];

function rewrite() {
    var stream = new Stream.Transform({ objectMode: true });

    stream._transform = function(file, unused, callback) {

        var map = {};

        map[file.relative] = String(file.contents);

        var text = map[file.relative];

        if( file.relative == filesArray[1] ){
        	text = map[file.relative].replace(/^\(/, '');
        	text = text.replace(/\(\)\);$/, '');
        }


        file.contents = new Buffer(text);

        callback(null, file);
    };

    return stream;
}

gulp.task('minify-js', function() {
    // var files = source('src/upload.js');

    gulp.src('src/upload.js').on('data', function(file) {
        console.log(file.contents);
    });

    gulp.src('src/upload.*.js')
        .pipe(rewrite())
        // .pipe(concat())
        .pipe(uglify())
        .pipe(rename('upload.min.js'))
        .pipe(gulp.dest('dist'));
});

// gulp default
gulp.task('default', ['minify-js', 'watch'], function() {
    console.log('the gulp entrance.');
    console.log("task start");
});

//监控
gulp.task('watch', function() {
    gulp.watch('upload.js', ['minify-js']);
});
