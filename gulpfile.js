"use strict";

const gulp = require("gulp"),
    gutil = require('gulp-util'),
    del = require("del"),
    changed = require("gulp-changed"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    size = require('gulp-size'),
    runSequence = require('run-sequence');


const src = ["src/app/*.html"],
    dest = "dist/";


gulp.task("default", ["assembly"]);

gulp.task("assembly", function(callback) {
    runSequence("clean", "copy", "build-js", function(err) {
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
    return del(dest).then(paths => {
        gutil.log("Cleaning has been completed!");
    });
});

gulp.task("copy", function() {
    return gulp.src(src)
        .pipe(changed(dest))
        .pipe(gulp.dest(dest))
        .on("end", function () { gutil.log("Copying files has been completed!"); });
});

gulp.task("build-js", function() {
    return browserify({
            entries: "./src/app/js/app.js",
            debug: true
        })
        .bundle()
        .on("error", gutil.log)
        // conversion from build to stream
        .pipe(source("app.js"))
        .pipe(buffer())
        // piping stream to tasks
        .pipe(uglify())
        .pipe(rename("app.min.js"))
        .pipe(size())
        .pipe(gulp.dest(dest + "js/"))
        .on("end", function () { gutil.log("Building JavaScript has been completed!"); });
});
