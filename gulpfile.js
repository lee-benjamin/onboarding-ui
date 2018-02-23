const gulp = require("gulp");
const connect = require("gulp-connect");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const browserify = require("browserify");
const fs = require("fs");

gulp.task("browserify", () => {
    browserify({
        entries: ["./app/js/helloWorld.js", "./app/js/twitter.js"],
        debug: true
    })
    .bundle()
    .pipe(fs.createWriteStream("./app/js/bundle.js"));
});

gulp.task("babel", () =>
    gulp.src("src/js/*.js")
        .pipe(babel({
            presets: ["es2017"]
        }))
        .pipe(gulp.dest("app/js"))
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
  gulp.watch(["./src/js/*.js"], ["babel", "browserify"]);
  gulp.watch(["./src/assets/*"], ["assets"]);
});

gulp.task("default", ["html", "sass", "babel", "browserify", "assets", "start-server", "watch"]);
