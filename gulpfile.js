const readline = require('readline');
const gulp = require('gulp');
const gulptasks = require('./gulptasks.js');

var env = process.env.NODE_ENV;
console.log(process.env.NODE_ENV);


var allTasks = [];
var gulpWatchFiles = require('./gulpWatchFiles.js');

gulpWatchFiles.forEach(function(item) {
  allTasks.push(item.taskname);
  watchNcompileEjs(item.file,item.taskname,item.data);
});

function watchNcompileEjs(file,taskname,data) {
  gulp.watch(file,[taskname]);
  gulp.task(taskname,function() {
    gulptasks.compileEjs(file,data);
  });
}

gulp.watch('./src/partials/*.ejs',allTasks);
gulp.task('allejs',allTasks);

gulp.watch('./src/js/*.js',['js']);
gulp.task('js', function() {
  gulptasks.js();
});

gulp.watch('./src/scss/*.scss',['scss']);
gulp.task('scss', function() {
  gulptasks.scss();
});

gulp.task('images', function() {
  gulptasks.images();
});

gulp.task('libs', function() {
  gulptasks.libs();
});

gulp.task('dev',['allejs','js','scss','libs']);

gulp.task('prod',['allejs','js','scss','libs','images']);

gulp.task('default',function() {
  gulptasks.message();
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  console.log(`Received: ${input}`);
  switch(input) {
    case 'ejs':
      gulptasks.compileAllEjs();
      break;
    case 'js':
      gulptasks.js();
      break;
    case 'image':
      gulptasks.images();
      break;
    case 'css':
      gulptasks.devScss();
      break;
    case 'cssp':
      gulptasks.prodScss();
      break;
    case 'prodcss':
      gulptasks.prodScss();
      break;
    case 'q':
      break;
    case 'default':
      break;
  }
  gulptasks.message();
});