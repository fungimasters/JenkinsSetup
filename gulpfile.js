var gulp = require('gulp');
const del = require('del');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var gutil = require('gulp-util');
var sassLint = require('gulp-sass-lint');
var sass = require('gulp-sass');

function handleError(error, level) {
  gutil.log(error.message);
    process.exit(1);
}
gulp.task('watch', ['browser-Sync'], function () {
  gulp.watch('app/scss/**/*.scss', ['compile']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/core/*.ts', ['compile']);
});

gulp.task('browser-Sync', ['compile', 'nodemon'], function () {
  browserSync({
    proxy: "localhost:3000", // local node app address
    port: 5000, // use *different* port than above
    notify: true
  });
});

gulp.task('sass', ['clean'], function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sassLint({
      options:
      {
        configFile: '.sass-lint.yml'
      }
    }).on('error', handleError))
    .pipe(sassLint.format().on('error', handleError))
    .pipe(sass().on('error', sass.logError).on('error', handleError))
    .pipe(gulp.dest('app/dist/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('clean', function () {
  return del('app/dist/**/*');
});

gulp.task('compile', ['clean','sass'], function () {
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