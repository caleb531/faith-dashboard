const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const workboxBuild = require('workbox-build');
const ts = require('gulp-typescript');
const tsConfig = require('./tsconfig.json');
const nodemon = require('gulp-nodemon');
const dotenv = require('dotenv');
dotenv.config();

gulp.task('clean', () => {
  return del('dist/**');
});

gulp.task('assets', () => {
  return gulp.src([
      'public/**/*'
    ])
    .pipe(gulp.dest('dist'));
});
gulp.task('assets:watch', () => {
  return gulp.watch('public/**/*', gulp.series('assets'));
});

gulp.task('sass', () => {
  return gulp.src('src/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/styles'));
});
gulp.task('sass:watch', () => {
  return gulp.watch('src/styles/**/*.scss', gulp.series('sass'));
});

gulp.task('webpack', () => {
  return webpack(webpackConfig)
    .pipe(gulp.dest('dist/scripts'));
});
gulp.task('webpack:watch', (cb) => {
  return gulp.src('src/scripts/index.tsx')
    .pipe(webpack(Object.assign({}, webpackConfig, { watch: true })))
    .pipe(gulp.dest('dist/scripts'));
});
gulp.task('ts:server', () => {
  return gulp.src([
      'src/server/**/*.ts'
    ])
    .pipe(ts(tsConfig.compilerOptions))
    .pipe(gulp.dest('dist/server'));
});

gulp.task('sw', () => {
  return workboxBuild.injectManifest({
    globDirectory: 'dist',
    globPatterns: [
      'scripts/**/*.js',
      'styles/*.css',
      'icons/*.svg',
      'app-icons/*.png'
    ],
    // Precaching index.html using templatedURLs fixes a "Response served by
    // service worker has redirections" error on iOS 12; see
    // <https://github.com/v8/v8.dev/issues/4> and
    // <https://github.com/v8/v8.dev/pull/7>
    templatedURLs: {
      // '.' must be used instead of '/' because the app is not served from the
      // root of the domain (but rather, from a subdirectory)
      '.': ['index.html']
    },
    swSrc: 'src/scripts/service-worker.js',
    swDest: 'dist/service-worker.js'
  }).then(({ warnings }) => {
    warnings.forEach(console.warn);
  });
});
gulp.task('sw:watch', () => {
  return gulp.watch([
    'dist/**/*',
    'src/scripts/service-worker.js',
    // Prevent an infinite loop by excluding the service worker from the above
    // watch on files in dist/
    '!dist/service-worker.js'
  ], gulp.series('sw'));
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'assets',
    'sass',
    'webpack',
    'ts:server'
  ),
  'sw'
));
gulp.task('watch', gulp.parallel(
  'assets:watch',
  'webpack:watch',
  'sass:watch',
  'sw:watch'
));
gulp.task('build:watch', gulp.series(
  'build',
  'watch'
));

gulp.task('connect', (done) => {
  nodemon({
    script: './dist/server/index.js',
    watch: ['src/server'],
    ext: 'ts',
    tasks: ['ts:server'],
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      ESV_API_TOKEN: process.env.ESV_API_TOKEN
    },
    done
  });
});
gulp.task('serve', gulp.series(
  'build',
  gulp.parallel(
    'connect',
    'watch'
  )
));
