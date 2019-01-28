'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),
    pngquant = require('imagemin-pngquant'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        jquery: 'build/js/libs/',
        bootstrap_js: 'build/js/libs/',
        bootstrap_css: 'build/css/libs/',
        tether: 'build/js/libs/'
    },
    src: {
        html: 'src/templates/index.html',
        js: 'src/js/*.js',
        style: 'src/styles/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        jquery: 'node_modules/jquery/dist/jquery.js',
        bootstrap_js: 'node_modules/bootstrap/dist/js/bootstrap.js',
        bootstrap_css: 'node_modules/bootstrap/dist/css/*.css',
        tether: 'node_modules/tether/dist/js/tether.js'
    },
    watch: {
        html: 'src/templates/*.html',
        js: 'src/js/*.js',
        style: 'src/styles/**/*.sass',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};
var config = {
    server: {
        baseDir: "./build/"
    },
    // tunnel: false,
    host: 'localhost',
    port: 3000,
    logPrefix: "test"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});
gulp.task('jquery:build', function () {
    gulp.src(path.src.jquery)
        .pipe(concat("jquery.js"))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.jquery))
        .pipe(reload({stream: true}));
});
gulp.task('tether:build', function () {
    gulp.src(path.src.tether)
        .pipe(concat("tether.js"))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.tether))
        .pipe(reload({stream: true}));
});
gulp.task('bootstrap_js:build', function () {
    gulp.src(path.src.bootstrap_js)
        .pipe(concat("bootstrap.js"))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.bootstrap_js))
        .pipe(reload({stream: true}));
});
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(prefixer())
        .pipe(concatCss("styles.css"))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});
gulp.task('bootstrap_css:build', function () {
    gulp.src(path.src.bootstrap_css)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concatCss("bootstrap.css"))
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.bootstrap_css))
        .pipe(reload({stream: true}));
});
gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});
gulp.task('build', [
    'html:build',
    'js:build',
    'jquery:build',
    'tether:build',
    'bootstrap_js:build',
    'style:build',
    'bootstrap_css:build',
    'fonts:build',
    'image:build'
]);
gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});
gulp.task('webserver', function () {
    browserSync(config);
});
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);