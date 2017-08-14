
var gulp = require('gulp'),

    // Util
    del = require('del'),
    copy = require('copy'),
    cache = require('gulp-cache'),
    watch = require('gulp-watch'),
    stream = require('event-stream'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-string-replace'),
    connect = require('gulp-connect'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),

    // Style
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),

    // Tests
    server = require('karma').Server,

    // Javascript
    jshint = require('gulp-jshint'),

    // Angular
    ngAnnotate = require('gulp-ng-annotate');

    // Paths
    var paths = {
        app : {
            file: './app/index.html',
            html: './app/html/**/*.html',
            scss: './app/scss/**/*.scss',
            js: './app/js/**/*.js',
            node: './node_modules/**'
        },
        dist : {
            root: './dist',
            css: './dist/css',
            js: './dist/js',
            html: './dist/html',
            lib: './dist/lib'
        }
    };

    // Start server port 8000
    gulp.task('connect', function() {
        connect.server({
            root: './dist',
            port: 8000,
            livereload:true
        });
    });

    // Copy
    gulp.task('copy', function() {
        gulp.src(paths.app.html)
            .pipe(gulp.dest(paths.dist.html))

        gulp.src(paths.app.file)
            .pipe(gulp.dest(paths.dist.root));
    });


    // Test TDD
    gulp.task('tdd', function (done) {
        new Server({
            configFile: __dirname + '/karma.conf.js',
        }, done).start();
    });

    // Test PhantomJS and Jasmine
    gulp.task('test', function (done) {
        return new Server({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }, done).start();
    });


    gulp.task('styles', function () {
        return gulp.src(paths.app.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist.css));
    });

    // // Styles
    // gulp.task('styles', () =>
    //     sass(paths.app.scss)
    // 		.on('error', sass.logError)
    //         .pipe(sourcemaps.init())
    //         .pipe(autoprefixer())
    //         .pipe(gulp.dest(paths.app.scss))
    //         .pipe(rename({ suffix: '.min' }))
    //         .pipe(cssnano())
    //         .pipe(sourcemaps.write('.'))
    //         .pipe(gulp.dest(paths.dist.css))
    // );

    // Styles
    // gulp.task('styles', function() {
    //   return sass('app/scss/main.scss', { style: 'expanded' })
    //     .pipe(sourcemaps.init())
    //     .pipe(autoprefixer())
    //     .pipe(rename({ suffix: '.min' }))
    //     .pipe(cssnano())
    //     .pipe(sourcemaps.write('.'))
    //     .pipe(gulp.dest(paths.dist.css))
    //     // .pipe(notify({ message: 'Styles task complete' }));
    // });





    // Js structure sintax
    gulp.task('lint', function() {
        return gulp.src(paths.app.js)
        .pipe(jshint()).on('error', errorHandler)
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
    });

    // Scripts
    gulp.task('scripts', function() {
        return stream.concat(
            gulp.src('app/js/app.js')
                .pipe(rename({ suffix: '.min' }))
                //.pipe(uglify())
                .pipe(gulp.dest(paths.dist.js)),

            gulp.src('app/js/controllers/**/*.js')
                .pipe(concat('controller.js'))
                .pipe(rename({ suffix: '.min' }))
                //.pipe(uglify())
                .pipe(gulp.dest(paths.dist.js)),

            gulp.src('app/js/configs/**/*.js')
                .pipe(concat('config.js'))
                .pipe(rename({ suffix: '.min' }))
                //.pipe(uglify())
                .pipe(gulp.dest(paths.dist.js))
        );
    });


    // Images
    gulp.task('images', function() {
        return gulp.src('app/images/**/*')
            .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
            .pipe(gulp.dest('../medic/images'));
            // .pipe(notify({ message: 'Images task complete' }));
    });


    // Vendor
    gulp.task('vendor', function() {
      return gulp.src(
          [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/angular/angular.min.js',
            'node_modules/angular-animate/angular-animate.min.js',
            'node_modules/angular-messages/angular-messages.min.js',
            'node_modules/angular-route/angular-route.min.js',
            'node_modules/ui-router/release/angular-ui-router.min.js',
            'node_modules/angular-loader/angular-loader.min.js'
          ])
          .pipe(ngAnnotate())
          .pipe(gulp.dest('./dist/vendor'))

    });

    // Clean
    gulp.task('clean', function() {
        return del(paths.dist.root, {force: true});
    });


    // Watch for change
    gulp.task('watch', function() {
        livereload.listen();
            gulp.watch(paths.app.html).on('change', livereload.changed);
            gulp.watch(paths.app.sass, ['styles']).on('change', livereload.changed);
            gulp.watch(paths.app.js, ['lint']).on('change', livereload.changed);
    });

    // Default task
    gulp.task('default', ['clean'], function() {
        gulp.start('connect','styles', 'scripts', 'vendor', 'images', 'copy', 'watch');
    });
