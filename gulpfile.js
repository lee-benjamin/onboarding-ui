var gulp = require("gulp");
var connect = require("gulp-connect");
var sass = require("gulp-sass");
const babel = require("gulp-babel");

gulp.task("babel", () =>
    gulp.src("src/js/*.js")
        .pipe(babel({
            presets: ["es2017"]
        }))
        .pipe(gulp.dest("app/js/"))
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

gulp.task("js", () =>
  gulp.src("./src/js/*.js")
    .pipe(gulp.dest("./app/js"))
    .pipe(connect.reload())
);

gulp.task("assets", () =>
   gulp.src("./src/assets/*.ico")
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
