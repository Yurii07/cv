const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');


const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
    // './src/css/some.css',
    './src/css/main.css'
];

const jsFiles = [
    './src/libs/isotope-docs/js/isotope-docs.min.js',
    './src/libs/jquery-circle-progress-1.2.2/dist/circle-progress.js',
    // './src/js/lib.js',
    './src/js/main.js'
];

function styles() {
    return gulp.src(cssFiles)
        .pipe(concat('all.css'))
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
}

function comp(){
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"

        },
        //tunnel: true // creates a temporary address can see the customer
    });

    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);
}


function clean() {
    return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
    gulp.parallel(styles, scripts, comp)
));

gulp.task('dev', gulp.series('build', 'watch'));
