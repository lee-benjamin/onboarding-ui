const gulp = require("gulp");
const connect = require("gulp-connect");
const sass = require("gulp-sass");
const babelify = require("babelify");
const browserify = require("browserify");
const fs = require("fs");
const source = require("vinyl-source-stream");

gulp.task("js", () =>
    browserify({entries: ["./src/js/components.js", "./src/js/twitter.js"], paths: ["./src/js"], debug: true})
        .transform(babelify.configure({
            presets: ["env"]
        }))
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("./app/js/"))
);

gulp.task("start-server", () =>
    connect.server({
        root: "app/",
        port: 9000,
        livereload: true
    })
);

gulp.task("hello", () =>
    console.log("Hello, World!")
);

gulp.task("html", () =>
  gulp.src("./src/*.html")
    .pipe(gulp.dest("./app"))
    .pipe(connect.reload())
);

gulp.task("sass", () =>
    gulp.src("./src/styles/sass/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./app/styles/css"))
);

gulp.task("assets", () =>
   gulp.src("./src/assets/*")
    .pipe(gulp.dest("./app/assets"))
    .pipe(connect.reload())
);

gulp.task("watch", () => {
  gulp.watch(["./src/*.html"], ["html"]);
  gulp.watch(["./src/styles/sass/*.scss"], ["sass"]);
  gulp.watch(["./src/js/*.js"], ["js"]);
  gulp.watch(["./src/assets/*"], ["assets"]);
});

gulp.task("default", ["html", "sass", "js", "assets", "start-server", "watch"]);
