/**
 *
 * Gulpfile setup
 *
 * @since 1.0.0
 */


// Project configuration
var project 		= 'UX Trends', // Project name
	url 		= './'; // Local Development URL for BrowserSync. Change as-needed.


// Load plugins
var gulp     = require('gulp'),
	browserSync  = require('browser-sync'),
	reload       = browserSync.reload,
	autoprefixer = require('gulp-autoprefixer'),
	minifycss    = require('gulp-uglifycss'),
	uglify       = require('gulp-uglify'),
	imagemin     = require('gulp-imagemin'),
	newer        = require('gulp-newer'),
	rename       = require('gulp-rename'),
	concat       = require('gulp-concat'),
	runSequence  = require('gulp-run-sequence'),
	sass         = require('gulp-sass'),
	plumber      = require('gulp-plumber'),
	cache        = require('gulp-cache'),
	watch 		   = require('gulp-watch'),
	stripDebug 	 = require('gulp-strip-debug'),
	include      = require('gulp-html-tag-include'),
	gutil        = require('gulp-util'),
	buffer        = require('vinyl-buffer'),
	merge2        = require('merge2'),
	svgSprite    = require('gulp-svg-sprite'),
	pngSprite    = require('gulp.spritesmith');


/**
 * Browser Sync
*/
gulp.task('browser-sync', function() {
    browserSync.init({
			server: {
        baseDir: url
			}
    });
});


/**
 * Styles
 *
 * Take all sass files, process, concat, minify, autoprefix and send theme to build
*/
gulp.task('styles', function () {
	return 	gulp.src('./source/sass/style.sass')
			.pipe(plumber())
			.pipe(sass({
				errLogToConsole: true,
				outputStyle: 'compact',
				precision: 10
			}))
			.pipe(plumber.stop())
			.pipe(autoprefixer({
				browsers: ['last 4 version']
			}))
			.pipe(minifycss({
				maxLineLen: 80
			}))
			.pipe(rename('style.css'))
			.pipe(gulp.dest('./assets/css/'))
});



/**
 * Scripts: Custom
 *
 * Take all js in js directory, concat, minify and send to build
*/
gulp.task('scriptsJs', function() {
	return 	gulp.src(['./source/js/app/app.js','./source/js/app/**/*.js'])
				.pipe(plumber())
				.pipe(concat('custom.js'))
				.pipe(gulp.dest('./assets/js/'))
				.pipe(rename( {
					basename: "custom",
					suffix: '.min'
				}))
				.pipe(stripDebug())
				.pipe(uglify())
				.pipe(gulp.dest('./assets/js/'))
});


/**
 * Scripts: Plugins
 *
 * Take all plugins js files, concat, minify and send theme to build
*/
gulp.task('pluginsJs', function() {
	return 	gulp.src('./source/js/lib/*.js')
				.pipe(concat('vendors.js'))
				.pipe(uglify())
				.pipe(gulp.dest('./assets/js/lib/'))
});


/**
 * html
 *
 * Take all html and send to build
*/
gulp.task('html', function() {
	return 	gulp.src('./source/*.html')
	      .pipe(include())
				.pipe(gulp.dest('./'))
});

/**
 * fonts
 *
 * Take all fonts and send to build
*/
gulp.task('fonts', function() {
	return 	gulp.src(['./src/fonts/*.oet','./src/fonts/*.otf','./src/fonts/*.svg','./src/fonts/*.ttf','./src/fonts/*.woff',])
				.pipe(gulp.dest('./assets/fonts/'))
});


/**
 * Images
 *
 * Look at src/img, optimize the images and send them to build
*/
gulp.task('images', function() {

// Add the newer pipe to pass through newer images only
	return 	gulp.src(['./source/images/*.{png,jpg,gif}'])
				.pipe(newer('./assets/'))
				.pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
				.pipe(gulp.dest('./assets/images'))
});


/**
 * svg
 *
 * Look at src/img/svg and send them to build
*/
gulp.task('svg', function() {

// Add the newer pipe to pass through newer images only
	return 	gulp.src(['./source/images/svg/*.svg'])
				.pipe(newer('./assets/images/svg/'))
				.pipe(gulp.dest('./assets/images/svg/'))
});


/**
 * Sprites
 *
 *
*/
gulp.task('spritePng', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('./source/images/sprite/*.png').pipe(pngSprite({
    imgName: 'sprite.png',
    retinaImgName: 'sprite@2x.png',
    retinaSrcFilter: ['./source/images/sprite/*@2x.png'],
    cssName: '_sprite.scss',
    imgPath: '../images/spritePng/sprite.png',
    retinaImgPath: '../images/spritePng/sprite@2x.png',

  }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
	  .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('./assets/images/spritePng/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest('./source/sass/spritePng/'));

  // Return a merged stream to handle both `end` events
  return merge2(imgStream, cssStream);
});


gulp.task('spriteSvg:pack', function () {
	return gulp.src('./source/images/svg/*.svg')
		.pipe(svgSprite({
			shape: {
				spacing: {
					padding: 5
				}
			},
			mode: {
				css: {
					dest: "./source/",
					layout: "diagonal",
					sprite: "../images/spriteSvg/sprite.svg",
					bust: false,
					render: {
						scss: {
							dest: "../sass/spriteSvg/_sprite.scss",
							template: "./source/sass/spriteSvg/_template.scss"
						}
					}
				}
			},
			variables: {
				mapname: "icons"
			}
		}))
		.pipe(gulp.dest("./source/"));
});

gulp.task('spriteSvg:deploy', function() {

	return 	gulp.src(['./source/images/spriteSvg/sprite.svg'])
				.pipe(gulp.dest('./assets/images/spriteSvg/'))
});

/**
 * Clean gulp cache
 */
 gulp.task('clear', function () {
   cache.clearAll();
 });


 // ==== TASKS ==== //

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('watch', function () {

	watch('./source/images/*.{png,jpg,gif}', function () {
		runSequence('images', function() {reload()});
	});
	watch('./source/images/svg/*.svg', function () {
		runSequence( 'svg', 'spriteSvg:pack','spriteSvg:deploy', 'styles', function() {reload()});
	});
	watch('./source/images/sprite/*.png', function () {
		runSequence( 'spritePng', 'styles', function() {reload()});
	});
	watch('./source/sass/**/*.sass', function () {
		runSequence('styles', function() {reload()});
	});
	watch('./source/js/app/**/*.js', function () {
		runSequence('scriptsJs', function() {reload()});
	});
	watch('./source/js/lib/*.js', function () {
		runSequence('pluginsJs', function() {reload()});
	});
	watch('./source/**/*.html', function () {
		runSequence('html', function() {reload()});
	});
});

gulp.task('default', ['watch']);

gulp.task('build', function () {
    runSequence('images', 'spritePng', 'spriteSvg:pack','spriteSvg:deploy', 'svg', 'styles', 'scriptsJs', 'pluginsJs', 'html', 'fonts');
});
