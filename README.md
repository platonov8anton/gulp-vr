# gulp-vr

Gulp plugin for long term caching static files. Renames files: file.ext => ia-Gd5r_5P3C8IwhDTkpEC7rQI.ext

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
```
npm install gulp-vr --save-dev
```

## Usage
```
const gulp = require('gulp')
const vg = require('gulp-vr')
 
gulp.task('default', () => {
  return gulp.src('src/*.{svg,css,js}')
      .pipe(vg.digest())
      .pipe(gulp.dest('dest'));
})
```

## API

### vg.createManifest([...paths])
* @param {...String} [paths] Paths to files
* @return {Object} Collection, \_\_proto__ === null

Creates a manifest from the contents of json files

### vg.digest([path])
* @param {String} [path] Path to file, to save the result
* @return {Stream}

Renames files: file.ext => ia-Gd5r_5P3C8IwhDTkpEC7rQI.ext

## License

MIT © Platonov Anton
