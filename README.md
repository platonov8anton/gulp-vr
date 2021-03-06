# gulp-vr

Gulp plugin for creating versions of static files.

Examples: 
* file.ext => ia-Gd5r_5P3C8IwhDTkpEC7rQI.ext
* file.ext => 54b0c58c7ce9f2a8b551351102ee0938.ext
* file.ext => file-1102ee0938.ext
* something else

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
```
npm install gulp-vr --save-dev
```
or
```
npm i gulp-vr -D
```

## Usage
```
const gulp = require('gulp')
const vr = require('gulp-vr')
 
gulp.task('default', () => {
  return gulp.src('src/*.{svg,css,js}')
      .pipe(vr.modifier())
      .pipe(gulp.dest('dest'));
})
```

## API

At the beginning 
https://nodejs.org/api/crypto.html#crypto_class_hash

### vr.createHashBase64(algorithm, data)
@param {String} algorithm  
@param {String|Buffer} data  
@return {String}

Returns a string of the form: ia-Gd5r_5P3C8IwhDTkpEC7rQI  
Convert base64 to a valid file name  
Valid characters in base64: 'A-Z', 'a-z', '0-9', '+', '/', '='  
'+', '/', '=' symbols in file names are forbidden  

### vr.createHashHex(algorithm, data)
@param {String} algorithm  
@param {String|Buffer} data  
@return {String}

Returns a string of the form: 54b0c58c7ce9f2a8b551351102ee0938

### vr.modifier(options)
@param {Object} [options]  
@param {Function} [options.modify]  
@param {Object} [options.hash]  
@param {String} [options.hash.algorithm=sha1]  
@param {String} [options.hash.encoding=base64]  
@return {Stream}

Modifies vinyl files. By default: file.ext => ia-Gd5r_5P3C8IwhDTkpEC7rQI.ext

#### options.modify(file)
@param {Vinyl} file - This is a proxy object over the current vinyl file. 
Available for writing properties: basename, stem, extname. 

Example:

```
function modify (file) {
  let mt = file.stat.mtime

  file.stem += `-${mt.getUTCFullYear()}-${mt.getUTCMonth()}-${mt.getUTCDay()}`
}
```

## License

MIT © Platonov Anton
