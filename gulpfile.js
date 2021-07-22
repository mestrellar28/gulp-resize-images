// Require gulp modules
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const responsive = require('gulp-responsive');
const webp = require('gulp-webp');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg')
const jpegtran = require('imagemin-jpegtran');
const optipng = require('imagemin-optipng');
const svgo = require('imagemin-svgo');
const rename = require('gulp-rename');
const del = require('del');

// File path variables
const root = 'src';
const dest = 'dist';

const imgSRC = 'src/images/**/*';
const imgDEST = 'dist/images/';

const svgSRC = 'src/vectors/**/*';
const svgDEST = 'dist/vectors/';


// Delete folder dist/ before compress and resize images
function clean() {
   return del(dest);
}

// Delete jpeg images on dist/ 
function delJpeg() {
   return del(imgDEST + '**/*.jpeg');
}

// Compress images on dist/ folder without resize
function image() {
   return gulp.src(imgDEST + '**/*')
      .pipe(imagemin([
         mozjpeg({
            quality: 80,
            progressive: true
         }),
         pngquant({quality: [0.70, 0.80]}),
         svgo({
            plugins: [{
                  removeViewBox: true
               },
               {
                  cleanupIDs: false
               }
            ]
         })
      ]))
      .pipe(gulp.dest(imgDEST))
}

// Change JPEG images to JPG on dist/ folder
function jpegToJpg() {
   return gulp.src(imgDEST + '**/*.jpeg')
      .pipe(imagemin([
         mozjpeg({quality: 80, progressive: true})
      ]))
      .pipe(rename({
         extname: '.jpg'
      }))
      .pipe(gulp.dest(imgDEST))
}

// Change PNG images to JPG on dist/ folder
function pngToJpg() {
   return gulp.src(imgDEST + '**/*.png')
      .pipe(imagemin([
         mozjpeg({quality: 80})
      ]))
      .pipe(rename({
         extname: '.jpg'
      }))
      .pipe(gulp.dest(imgDEST))
}

// Convert images to WEBP from src/ to dist/ 
function toWebp() {
   return gulp.src(imgSRC)
      .pipe(webp({quality: 80}))
      .pipe(gulp.dest(imgDEST))
}

// Resize and compress images from src/ to dist/
function resize() {
   return gulp.src(imgSRC)
      .pipe(responsive({ 
         '**/*.{png,jpg}': [{
            width: 360,
            quality: 80,
            progressive: true,
            rename: {
               suffix: '-sm'
            },
            withoutEnlargement: true
         }, {
            width: 480,
            quality: 80,
            rename: {
               suffix: '-md'
            },
            withoutEnlargement: true
         }, {
            width: 720,
            quality: 80,
            progressive: true,
            rename: {
               suffix: '-lg'
            },
            withoutEnlargement: true
         }, {
            width: 1200,
            quality: 80,
            progressive: true,
            rename: {
               suffix: '-xl'
            },
            withoutEnlargement: true
         }, {
            quality: 80,
            progressive: true,
         }],
         '**/*': [{
            width: 360,
            quality: 80,
            rename: {
               suffix: '-sm',
               extname: '.webp'
            },
            withoutEnlargement: true
         }, {
            width: 480,
            quality: 80,
            rename: {
               suffix: '-md',
               extname: '.webp'
            },
            withoutEnlargement: true
         }, {
            width: 720,
            quality: 80,
            rename: {
               suffix: '-lg',
               extname: '.webp'
            },
            withoutEnlargement: true
         }, {
            width: 1200,
            quality: 80,
            rename: {
               suffix: '-xl',
               extname: '.webp'
            },
            withoutEnlargement: true
         }, {
            quality: 80,
            rename: {
               extname: '.webp'
            }
         },]
      }, {
         errorOnEnlargement: false
      }))
      .pipe(gulp.dest(imgDEST));
}


// Compress SVG images from src/ to dist/
function vector() {
   return gulp.src(svgSRC)
      .pipe(imagemin([
         svgo({
            plugins: [{
                  removeViewBox: true
               },
               {
                  cleanupIDs: false
               }
            ]
         })
      ]))
      .pipe(gulp.dest(svgDEST))
}


// Tasks
exports.image = image;
exports.resize = resize;
exports.clean = clean;
exports.toWebp = toWebp;
exports.pngToJpg = pngToJpg;
exports.jpegToJpg = jpegToJpg;
exports.delJpeg = delJpeg;
exports.vector = vector;

exports.compress = gulp.series(clean, resize);