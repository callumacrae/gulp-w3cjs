# gulp-w3cjs [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> [w3cjs](https://github.com/thomasdavis/w3cjs) wrapper for [gulp](https://github.com/wearefractal/gulp) to validate your HTML

## Usage

First, install `gulp-w3cjs` as a development dependency:

```shell
npm install --save-dev gulp-w3cjs
```

Then, add it to your `gulpfile.js`:

```javascript
var w3cjs = require('gulp-w3cjs');

gulp.task('w3cjs', function () {
	gulp.src('src/*.html')
		.pipe(w3cjs());
});
```

### Reporting

The results are added onto each file object under `w3cjs`, containing `success` (Boolean) and `messages` (Array). 

**Example usage**

```javascript
var w3cjs = require('gulp-w3cjs');
var through2 = require('through2');

gulp.task('example', function () {
	gulp.src('src/*.html')
		.pipe(w3cjs())
		.pipe(through2.obj(function(file, enc, cb){
			cb(null, file);
			if (!file.w3cjs.success){
				throw new Error('HTML validation error(s) found');
			}
		}));
});
```

**Example output**

```shell
HTML Error: index.html Line 5, Column 19: Element title must not be empty.
    <title></title>

.../gulpfile.js:11
                                throw new Error('HTML validation error(s) found');
                                      ^
Error: HTML validation error(s) found
```

## API

### w3cjs(options)

#### options.doctype

Doctype to use. Defaults to false for autodetect.

#### options.charset

Charset to use. Defaults to false for autodetect.

Both options are part of the [w3cjs](https://github.com/thomasdavis/w3cjs) library, which uses the W3C validator.

#### options.url

URL to the w3c validator. Use if you want to use a local validator. This is the
same thing as `w3cjs.setW3cCheckUrl()`.

### w3cjs.setW3cCheckUrl(url)

Same as options.url. SEt's the URL to the w3c validator.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-w3cjs
[npm-image]: https://badge.fury.io/js/gulp-w3cjs.png

[travis-url]: http://travis-ci.org/callumacrae/gulp-w3cjs
[travis-image]: https://secure.travis-ci.org/callumacrae/gulp-w3cjs.png?branch=master

[depstat-url]: https://david-dm.org/callumacrae/gulp-w3cjs
[depstat-image]: https://david-dm.org/callumacrae/gulp-w3cjs.png
