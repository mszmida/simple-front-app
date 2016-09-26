"use strict";

const autoprefixer = require("autoprefixer"),
    browserify = require("browserify"),
    buffer = require("vinyl-buffer"),
    chalk = require("chalk"),
    changed = require("gulp-changed"),
    cssnano = require("cssnano"),
    del = require("del"),
    gif = require("gulp-if"),
    gulp = require("gulp"),
    gutil = require("gulp-util"),
    jstify = require("jstify"),
    path = require("path"),
    postcss = require("gulp-postcss"),
    rename = require("gulp-rename"),
    runSequence = require("run-sequence"),
    sass = require("gulp-sass"),
    size = require("gulp-size"),
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    watchify = require("watchify");


const config =  {
        indexPath: "./src/index.html",
        jsEntryPath: "./src/init.js",
        jsPaths: ["./src/js/"],
        sassPath: "./src/sass/**/*.scss",
        distPath: "./dist/",
        prod: !!gutil.env.production
    },
    jsDistPath = path.join(config.distPath, "js/"),
    cssDistPath = path.join(config.distPath, "assets/css/"),
    // bold theme definition
    bold = chalk.bold,
    ENV = bold.green(!config.prod ? "development" : "production"),
    ERROR = bold(`[ ${bold.red("ERROR")} ]`),
    OK = bold(`[ ${bold.green("OK")} ]`);


gutil.log(bold(`[ LOG ] Gulp started in ${ENV} mode!`));

function makeBundle(browserify) {
    return browserify.bundle()
            .on("error", function (err) {
                gutil.log(bold(`${ERROR} Browserify bundle() error: ${err}`));
            })
        // conversion from browserify text stream into vinyl stream
        .pipe(source("main.js"))
        // conversion from vinyl stream into vinyl buffer
        .pipe(buffer())
        // piping stream further to another plugins
        .pipe( gif(!config.prod, sourcemaps.init({ loadMaps: true })) )
        .pipe(uglify()
            .on("error", function (err) {
                gutil.log(bold(`${ERROR} Uglify error: ${err}`));
            }))
        .pipe(rename("main.min.js"))
        .pipe(size({ title: "JavaScript bundle size:" }))
        .pipe( gif(!config.prod, sourcemaps.write(".")) )
        .pipe(gulp.dest(jsDistPath))
            .on("end", function () {
                gutil.log(bold(`${OK} Building of JavaScript bundle has been completed!\n`));
            });
}

function copy(source, destination) {
    return gulp.src(source)
        .pipe(changed(destination))
        .pipe(gulp.dest(destination));
}

function onChange(event) {
    gutil.log(bold(`[ LOG ] File ${bold.green(event.path)} was ${bold.green(event.type)}...`));
}


gulp.task("default", ["assembly"]);

gulp.task("assembly", function(callback) {
    runSequence("clean", ["copy-index", "js", "sass"], function(err) {
        if (err) {
            const exitCode = 1;
            gutil.log(bold(`${ERROR} Task 'assembly' failed: ${err}`));
            gutil.log(bold(`${ERROR} Task 'assembly' - exiting with code ${exitCode}`));

            return process.exit(exitCode);
        }

        gutil.log(bold(`${OK} Project assembling has been completed!`));

        return callback();
    });
});

gulp.task("clean", function() {
    return del(config.distPath).then(paths => {
        gutil.log(bold(`${OK} Cleaning has been completed!`));
    });
});

gulp.task("copy-index", function() {
    return copy(config.indexPath, config.distPath)
        .on("end", function () {
            gutil.log(bold(`${OK} Index file has been updated!`));
        });
});

gulp.task("js", function() {
    const b = browserify({
            entries: config.jsEntryPath,
            paths: config.jsPaths,
            debug: !config.prod
        });

    // jstify is a Browserify transform for creating modules of pre-compiled Underscore templates
    b.transform(jstify);

    return makeBundle(b);
});

gulp.task("sass", function() {
    const processors = [
        autoprefixer({
            browsers: [
                "Android 2.3",
                "Android >= 4",
                "Chrome >= 20",
                "Firefox >= 24",
                "Explorer >= 8",
                "iOS >= 6",
                "Opera >= 12",
                "Safari >= 6"
            ]
        }),
        cssnano
    ];

    return gulp.src(config.sassPath)
        .pipe( gif(!config.prod, sourcemaps.init()) )
        .pipe(sass({
            includePaths: ["./node_modules/bootstrap-sass/assets/stylesheets/"],
            precision: 8
        }).on("error", sass.logError))
        // PostCSS
        .pipe(postcss(processors))
        .pipe(rename("main.min.css"))
        .pipe(size({ title: "CSS bundle size:" }))
        .pipe( gif(!config.prod, sourcemaps.write(".")) )
        .pipe(gulp.dest(cssDistPath))
            .on("end", function () {
                gutil.log(bold(`${OK} Compilation of Sass files has been completed!`));
            });
});

gulp.task("watch", function (callback) {
    runSequence("clean", ["watch-html", "watch-js", "watch-sass"], callback);
});

gulp.task("watch-html", ["copy-index"], function() {
    gulp.watch(config.indexPath, ["copy-index"])
        .on("change", onChange);
});

gulp.task("watch-js", function() {
    const b = browserify({
            entries: config.jsEntryPath,
            paths: config.jsPaths,
            debug: !config.prod,
            cache: {},
            packageCache: {},
        });

    b.plugin(watchify, {
        ignoreWatch: ["**/node_modules/**"]
    })
        .on("update", function (ids) {
            gutil.log(bold(`[ LOG ] Changes in JavaScript files:\n${bold.green(ids.join("\n"))}\nhas been detected...`));

            return makeBundle(b);
        })
        .on("log", function (msg) {
            gutil.log(msg);
        });

    // jstify is a Browserify transform for creating modules of pre-compiled Underscore templates
    b.transform(jstify);

    return makeBundle(b);
});

gulp.task("watch-sass", ["sass"], function() {
    gulp.watch(config.sassPath, ["sass"])
        .on("change", onChange);
});
