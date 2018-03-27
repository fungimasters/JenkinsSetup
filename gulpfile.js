var gulp = require('gulp');
var sass = require('gulp-sass');
const del = require('del');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
const eslint = require('gulp-eslint');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var gutil = require('gulp-util');

gulp.task('watch', ['browser-Sync', 'sass'], function () {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/core/*.ts', browserSync.reload);
});

gulp.task('browser-Sync', ['compile','nodemon'], function () {
  browserSync({
    proxy: "localhost:3000", // local node app address
    port: 5000, // use *different* port than above
    notify: true
  });
});

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass())
    .pipe(gulp.dest('app/dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('clean', function () {
  return del('app/dist/**/*');
});

function handleError(level, error) {
  gutil.log(error.message);
  if (isFatal(level)) {
     process.exit(1);
  }
}
gulp.task('compile', ['clean'], function () {
    return tsProject.src()
        .pipe(tsProject())
        .on('error', handleError)
        .js.pipe(gulp.dest("app/dist/js"));
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
      script: 'server.js',
      ignore: [
        'gulpfile.js',
        'node_modules/'
      ]
    })
    .on('start', function () {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function () {
      setTimeout(function () {
        reload({
          stream: false
        });
      }, 1000);
    });
});