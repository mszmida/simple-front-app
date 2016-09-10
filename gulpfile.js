"use strict";

const gulp = require("gulp"),
    gutil = require('gulp-util'),
    del = require("del"),
    changed = require("gulp-changed"),
    browserify = require("browserify"),
    watchify = require('watchify'),
    jstify = require("jstify"),
    source = require("vinyl-source-stream"),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    size = require('gulp-size'),
    runSequence = require('run-sequence');


const indexPath = "./src/app/index.html",
    mainPath = "./src/app/js/main.js",
    distPath = "./dist/";


function makeBundle(browserify) {
    return browserify.bundle()
        .on("error", gutil.log)
        // conversion from browserify text stream into vinyl stream
        .pipe(source("main.js"))
        // conversion from vinyl stream into vinyl buffer
        .pipe(buffer())
        // piping stream further
        // .pipe(uglify())
        .pipe(rename("main.min.js"))
        .pipe(size())
        .pipe(gulp.dest(distPath + "js/"))
            .on("end", function () {
                gutil.log("Building JavaScript bundle has been completed!\n");
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
            gutil.log("[ERROR] gulp build task failed", err);
            gutil.log("[FAIL] gulp build task failed - exiting with code " + exitCode);

            return process.exit(exitCode);
        }

        gutil.log("Project assembling has been completed!");

        return callback();
    });
});

gulp.task("clean", function() {
    return del(distPath).then(paths => {
        gutil.log("Cleaning has been completed!");
    });
});

gulp.task("copy-index", function() {
    return copy(indexPath, distPath)
        .on("end", function () {
            gutil.log("Index file has been updated!");
        });
});

gulp.task("build-js", function() {
    var b = browserify({
            entries: [mainPath],
            debug: true
        });

    // jstify is a Browserify transform for creating modules of pre-compiled Underscore templates
    b.transform(jstify);

    return makeBundle(b);
});

gulp.task("watch", ["watch-html", "watch-js"]);

gulp.task("watch-html", ["copy-index"], function() {
    gulp.watch(indexPath, ["copy-index"]);
});

gulp.task("watch-js", function() {
    var b = browserify({
            entries: [mainPath],
            debug: true,
            cache: {},
            packageCache: {},
        });

    b.plugin(watchify, {
        ignoreWatch: ["**/node_modules/**"]
    })
        .on("update", function () {
            return makeBundle(b);
        })
        .on("log", function (msg) {
            gutil.log(msg);
        });

    // jstify is a Browserify transform for creating modules of pre-compiled Underscore templates
    b.transform(jstify);

    return makeBundle(b);
});
