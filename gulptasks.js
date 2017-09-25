const gulp = require('gulp');
const gulpif = require('gulp-if');
const ejs = require('gulp-ejs');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const fsextra = require('fs-extra');
const gulpWatchFiles = require('./gulpWatchFiles.js');

var gulptasks = {};

var dev = process.env.NODE_ENV == 'production' ? false : true;

gulptasks.scss = function() {
  gulp.src('./src/scss/*.scss')
    .pipe(gulpif(dev,sourcemaps.init()))
    .pipe(gulpif(dev,sass({outputStyle: 'expanded'}).on('error', sass.logError)))
    .pipe(gulpif(!dev,sass({outputStyle: 'compressed'}).on('error', sass.logError)))
    .pipe(gulpif(dev,sourcemaps.write('./maps')))
    .pipe(gulp.dest('./dist/css'));
}

gulptasks.compileEjs = function(file,data) {
  gulp.src(file)
    .pipe(ejs(data,{},{ext: '.html'}))
    .pipe(gulp.dest('./dist'));
}

gulptasks.compileAllEjs = function() {
  gulpWatchFiles.forEach(function(item) {
    gulp.src(item.file)
      .pipe(ejs(item.data,{},{ext: '.html'}))
      .pipe(gulp.dest('./dist'));
  })
}

gulptasks.js = function() {
  gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
}

gulptasks.images = function() {
  gulp.src(['./src/images/*'])
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images'));
}

gulptasks.libs = function() {
  let src = './src/libs';
  let dest = './dist/libs';
  fsextra.copy(src,dest)
  .then(() => {
    console.log(`copy ${src} done!`);
  })
  .catch((err) => {
    console.log(err);
  });

}

gulptasks.message = function() {
  console.log(`
you can choose one option to run the gulp task:
ejs: compile all ejs
css: compile all scss with sourcemaps and pretty css style
cssp: compile all scss with compressed css format
image: compress all images
  `);
}

module.exports = gulptasks;