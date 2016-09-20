"use strict";

const gulp = require("gulp"),
    gutil = require("gulp-util"),
    chalk = require("chalk"),
    del = require("del"),
    changed = require("gulp-changed"),
    browserify = require("browserify"),
    watchify = require("watchify"),
    jstify = require("jstify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    gif = require("gulp-if"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    size = require("gulp-size"),
    runSequence = require("run-sequence");


const config =  {
        indexPath: "./src/index.html",
        entries: ["./src/init.js"],
        paths: ["./src/js/"],
        distPath: "./dist/",
        prod: !!gutil.env.production
    },
    // bold theme definition
    bold = chalk.bold,
    ENV = bold.green(!config.prod ? "development" : "production"),
    ERROR = bold(`[ ${bold.red("ERROR")} ]`),
    OK = bold(`[ ${bold.green("OK")} ]`);


gutil.log(bold(`[ LOG ] Gulp started in ${ENV} mode!`));

function makeBundle(browserify) {
    return browserify.bundle()
        .on("error", gutil.log)
        // conversion from browserify text stream into vinyl stream
        .pipe(source("main.js"))
        // conversion from vinyl stream into vinyl buffer
        .pipe(buffer())
        // piping stream further to another plugins
        .pipe( gif(!config.prod, sourcemaps.init({ loadMaps: true })) )
        .pipe(uglify().on("error", gutil.log))
        .pipe(rename("main.min.js"))
        .pipe(size({ title: "Bundle size:" }))
        .pipe( gif(!config.prod, sourcemaps.write("./")) )
        .pipe(gulp.dest(config.distPath + "js/"))
            .on("end", function () {
                gutil.log(bold(`${OK} Building JavaScript bundle has been completed!\n`));
            });
}

function copy(source, destination) {
    return gulp.src(source)
        .pipe(changed(destination))
        .pipe(gulp.dest(destination));
}


gulp.task("default", ["assembly"]);

gulp.task("assembly", function(callback) {
    runSequence("clean", "copy-index", "build-js", function(err) {
        if (err) {
            var exitCode = 1;
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

gulp.task("build-js", function() {
    var b = browserify({
            entries: config.entries,
            paths: config.paths,
            debug: true
        });

    // jstify is a Browserify transform for creating modules of pre-compiled Underscore templates
    b.transform(jstify);

    return makeBundle(b);
});

gulp.task("watch", function (callback) {
    runSequence("clean", ["watch-html", "watch-js"], callback);
});

gulp.task("watch-html", ["copy-index"], function() {
    gulp.watch(config.indexPath, ["copy-index"]);
});

gulp.task("watch-js", function() {
    var b = browserify({
            entries: config.entries,
            paths: config.paths,
            debug: true,
            cache: {},
            packageCache: {},
        });

    b.plugin(watchify, {
        ignoreWatch: ["**/node_modules/**"]
    })
        .on("update", function () {
            gutil.log(bold("[ LOG ] Changes in JavaScript detected!"));

            return makeBundle(b);
        })
        .on("log", function (msg) {
            gutil.log(msg);
        });

    // jstify is a Browserify transform for creating modules of pre-compiled Underscore templates
    b.transform(jstify);

    return makeBundle(b);
});
