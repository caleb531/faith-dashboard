const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const connect = require('gulp-connect');

gulp.task('assets:core', () => {
  return gulp.src([
      'public/**/*'
    ])
    .pipe(gulp.dest('dist'));
});
gulp.task('assets', gulp.parallel(
  'assets:core'
));
gulp.task('assets:watch', () => {
  return gulp.watch('public/**/*', gulp.series('assets:core'));
});

gulp.task('sass', () => {
  return gulp.src('src/styles/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/styles'));
});
gulp.task('sass:watch', () => {
  return gulp.watch('src/styles/**/*.scss', gulp.series('sass'));
});

gulp.task('webpack:app', () => {
  return webpack(webpackConfig)
    .pipe(gulp.dest('dist/scripts'));
});
gulp.task('webpack:watch', () => {
  return webpack(Object.assign({}, webpackConfig, { watch: true }))
    .pipe(gulp.dest('dist/scripts'));
});
gulp.task('webpack', gulp.parallel(
  'webpack:app'
));

gulp.task('build', gulp.parallel(
  'assets',
  'sass',
  'webpack'
));
gulp.task('watch', gulp.parallel(
  'assets:watch',
  'sass:watch',
  'webpack:watch'
));
gulp.task('build:watch', gulp.series(
  'build',
  'watch'
));

gulp.task('connect', () => {
  connect.server({
    root: 'dist',
    host: '0.0.0.0'
  });
});
gulp.task('serve', gulp.series(
  'build',
  gulp.parallel(
    'connect',
    'watch'
  )
));
