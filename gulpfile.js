'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var uglify = require('gulp-uglify');
var del = require('del');


gulp.task('clean', function(cb){
    del('dist/**/*', cb); 
})

// add custom browserify options here
var customOpts = {
  entries: ['./web/src/index.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

gulp.task('default', ['js'], function(){

})

function bundle() {

  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./web/dist'));
}