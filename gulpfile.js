var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');

var config = {
	dist: 'dist/',
	src: 'src/',
	cssin: 'src/css/**/*.css',
	jsin: 'src/js**/*.js',
	htmlin: 'src/*.html',
	scssin: 'src/scss/**/*.scss',
	cssout: 'dist/css/',
	jsout: 'dist/js/',
	htmlout: 'dist/',
	scssout: 'src/css',
	cssoutname: 'style.css',
	jsoutname: 'script.js',
	cssreplaceout: 'css/style.css',
	jsreplaceout: 'js/script.js',
};

// Static Server + watching scss/html files
function serve() {
	browserSync.init({
		server: config.src,
	});

	gulp.watch(config.scssin, gulp.series(scss));
	gulp.watch([config.htmlin, config.jsin]).on('change', browserSync.reload);
}

// Compile sass into CSS & auto-inject into browsers
function scss() {
	return gulp
		.src(config.scssin)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.scssout))
		.pipe(browserSync.stream());
}

function cleanCss() {
	return gulp
		.src(config.cssin)
		.pipe(concat(config.cssoutname))
		.pipe(cleanCSS())
		.pipe(gulp.dest(config.cssout));
}

function cleanJs() {
	return gulp
		.src(config.jsin)
		.pipe(concat(config.jsoutname))
		.pipe(uglify())
		.pipe(gulp.dest(config.jsout));
}

function html() {
	return gulp
		.src(config.htmlin)
		.pipe(
			htmlReplace({
				css: config.cssreplaceout,
				js: config.jsreplaceout,
			}),
		)
		.pipe(
			htmlMin({
				sortAttributes: true,
				sortClassName: true,
				collapseWhitespace: true,
			}),
		)
		.pipe(gulp.dest(config.dist));
}

function img() {
	return gulp
		.src('src/img/**/*.{jpg,jpeg,png,gif}')
		.pipe(changed('dist/img'))
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
}

function clean() {
	return del(['dist']);
}

gulp.task('default', gulp.series(scss, serve));
gulp.task('build', gulp.series(clean, scss, cleanCss, cleanJs, html, img));
