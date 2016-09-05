"use strict";

const gulp = require("gulp"),
    gutil = require('gulp-util'),
    del = require("del"),
    changed = require("gulp-changed");


const src = ["src/app/*.html"],
    dest = "dist/";


gulp.task("default", ["assembly"]);

gulp.task("assembly", ["clean", "copy"], function() {
    gutil.log("Assembling has been completed.");
});

gulp.task("clean", function() {
    return del(dest).then(paths => {
        gutil.log("Cleaning done!");
    });
});

gulp.task("copy", function() {
    return gulp.src(src)
        .pipe(changed(dest))
        .pipe(gulp.dest(dest))
        .on("end", function () { gutil.log("Copying files done!") });
});
