var gulp = require("gulp");
var connect = require("gulp-connect");
var sass = require("gulp-sass");

gulp.task("dev", function() {
    connect.server({
        root: "app/",
        port: 9000,
        livereload: true
    });
});

gulp.task("hello", function() {
    console.log("Hello, World!");
});

gulp.task("html", function () {
  gulp.src("./app/*.html")
    .pipe(gulp.dest("./app"))
    .pipe(connect.reload());
});

gulp.task("css", function () {
  gulp.src("./app/styles/*.css")
    .pipe(gulp.dest("./app/styles/css/"))
    .pipe(connect.reload());
});

gulp.task("sass", function() {
    gulp.src("./app/styles/sass/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./app/styles/css"));
});

gulp.task("js", function () {
  gulp.src("./app/js/*.js")
    .pipe(gulp.dest("./app/js"))
    .pipe(connect.reload());
});

gulp.task("icons", function () {
   gulp.src("./app/assets/*.ico")
    .pipe(gulp.dest("./app/assets"))
    .pipe(connect.reload());
});

gulp.task("watch", function () {
  gulp.watch(["./app/*.html"], ["html"]);
  gulp.watch(["./app/styles/css/*.css"], ["css"]);
  gulp.watch(["./app/styles/sass/*.scss"], ["sass"]);
  gulp.watch(["./app/js/*.js"], ["js"]);
  gulp.watch(["./app/assets/*.js"], ["icons"]);
});

gulp.task("default", ["dev", "watch"]);
