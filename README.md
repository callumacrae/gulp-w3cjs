(PLUGIN AUTHOR: Please read [Plugin README conventions](https://github.com/wearefractal/gulp/wiki/Plugin-README-Conventions), then delete this line)

# gulp-w3c-validate [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> w3c-validate plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-w3c-validate` as a development dependency:

```shell
npm install --save-dev gulp-w3c-validate
```

Then, add it to your `gulpfile.js`:

```javascript
var w3c-validate = require("gulp-w3c-validate");

gulp.src("./src/*.ext")
	.pipe(w3c-validate({
		msg: "Hello Gulp!"
	}))
	.pipe(gulp.dest("./dist"));
```

## API

### w3c-validate(options)

#### options.msg
Type: `String`  
Default: `Hello World`

The message you wish to attach to file.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-w3c-validate
[npm-image]: https://badge.fury.io/js/gulp-w3c-validate.png

[travis-url]: http://travis-ci.org/callumacrae/gulp-w3c-validate
[travis-image]: https://secure.travis-ci.org/callumacrae/gulp-w3c-validate.png?branch=master

[depstat-url]: https://david-dm.org/callumacrae/gulp-w3c-validate
[depstat-image]: https://david-dm.org/callumacrae/gulp-w3c-validate.png
