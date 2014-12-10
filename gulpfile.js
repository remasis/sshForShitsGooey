var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));
var bower = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var del = require('del');
var ngHtml2js = require('gulp-ng-html2js');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var karma = require('karma');
var livereload = require('gulp-livereload');

//TMP
var gprint = require('gulp-print');

var publishDir = 'dist';
var dist = {
	all: [publishDir + '/**/*'],
	css: publishDir + '/static/',
	js: publishDir + '/static/',
	templates: publishDir + '/static/',
	vendor: publishDir + '/static/',
	assets: publishDir + '/static/'
};

var sources = {
	js: ['./src/**/*.js', '!./src/**/*.spec.js'],
	less: ['./src/**/*.less'],
	templates: ['./src/**/*.tpl.html'],
	assets: ['./assets/**/*']
};

var IS_RELEASE_BUILD = !!argv.release;

gulp.task('clean', function(cb) {
	del([publishDir + '/*'], cb);
});

gulp.task('lint', function() {
	return gulp.src(sources.js)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('js', ['lint'], function() {
	return gulp.src(sources.js)
		.pipe(ngAnnotate())
		.pipe(gulpif(IS_RELEASE_BUILD, uglify()))
		.pipe(gulpif(IS_RELEASE_BUILD, concat('app.min.js')))
		.pipe(gulp.dest(publishDir))
		.pipe(gprint());
});

gulp.task('less', function() {
	return gulp.src(sources.less)
		.pipe(less())
		.pipe(concat('app.css'))
		.pipe(gulp.dest(dist.css));
});


gulp.task('index', ['js'], function() {
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var target, src, relative;
	if (!IS_RELEASE_BUILD) {
		target = gulp.src('./src/index.html');
		src = gulp.src(sources.js, {
			read: false
		});
	} else {
		target = gulp.src('./src/index.html')
			.pipe(gulp.dest(publishDir));
		src = gulp.src(publishDir + '/app.min.js', {
			read: false
		});
	}

	return target.pipe(inject(src, {
			relative: true
		}))
		.pipe(gulp.dest(publishDir));
});

gulp.task('templates', function() {
	//resulting html file is statically included on base index.html
	return gulp.src(sources.templates)
		.pipe(ngHtml2js({
			moduleName: 'htmlTemplates',
			stripPrefix: 'app/',
			declareModule: true
		}))
		.pipe(ngAnnotate())
		.pipe(concat('htmlTemplates.js'))
		.pipe(gulp.dest(dist.templates));
});

gulp.task('bower', function() {
	//vendor.js is statically included on base index.html
	var jsFilter = gulpFilter(['**/*.js', '!**/angular-mocks.js']);
	var cssFilter = gulpFilter('**/*.css');
	return gulp.src(bower())
		.pipe(jsFilter)
		// .pipe(gprint())
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest(dist.vendor))
		.pipe(jsFilter.restore())
		.pipe(cssFilter)
		// .pipe(gprint())
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest(dist.vendor))
		.pipe(cssFilter.restore());
});

gulp.task('assets', function() {
	return gulp.src(sources.assets)
		.pipe(gulp.dest(dist.assets));
});

gulp.task('testonce', ['js', 'bower'], function(done) {
	karma.server.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);
});

gulp.task('livereload', function() {
	livereload.listen();
	gulp.watch(publishDir + '/**').on('change', livereload.changed);
});

gulp.task('watch', ['build', 'livereload'], function(done) {
	gulp.watch(sources.js, ['js']);
	gulp.watch(sources.less, ['less']);
	gulp.watch(sources.templates, ['templates']);
	gulp.watch('src/index.html', ['index']);

	karma.server.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: false
	}, done);
});

gulp.task('build', ['bower', 'assets', 'templates', 'index', 'js', 'less']);