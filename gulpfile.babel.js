'use strict';

import plugins    from 'gulp-load-plugins';
import yargs      from 'yargs';
import browser    from 'browser-sync';
import gulp       from 'gulp';
import rimraf     from 'rimraf';
import yaml       from 'js-yaml';
import fs         from 'fs';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const { COMPATIBILITY, PATHS } = loadConfig();

function loadConfig() {
    let ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build', gulp.series(clean, gulp.parallel(sass, javascript)));

// Build the site, run the server, and watch for file changes
gulp.task('default', gulp.series('build', server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
    rimraf(PATHS.dist, done);
}

function images() {
    return gulp.src('src/img/**/*')
        .pipe($.if(PRODUCTION, $.imagemin({
            progressive: true
        })))
        .pipe(gulp.dest(PATHS.dist));
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
    return gulp.src('src/sass/app.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
                includePaths: PATHS.sass
            })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: COMPATIBILITY
        }))
        // Comment in the pipe below to run UnCSS in production
        .pipe($.if(PRODUCTION, $.cssnano()))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(PATHS.dist))
        .pipe(browser.reload({ stream: true }));
}

// Combine JavaScript into one file
// In production, the file is minified
function javascript() {
    return gulp.src(PATHS.javascript)
        .pipe($.sourcemaps.init())
        //.pipe($.babel())
        .pipe($.concat('app.js'))
        .pipe($.if(PRODUCTION, $.uglify().on('error', e => { console.log(e); })))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(PATHS.dist));
}

function server(done) {
    browser.init({
        injectChanges: true,
        proxy: "http://sophia.dev/"
    });
    done();
}

// Watch for changes to static src, Sass, and JavaScript
function watch() {
    gulp.watch('index.html').on('change', browser.reload);
    gulp.watch('src/sass/**/*.scss', sass);
    gulp.watch('src/img/**/*').on('change', gulp.series(images, browser.reload));
    gulp.watch('src/js/**/*.js').on('change', gulp.series(javascript, browser.reload));
}
