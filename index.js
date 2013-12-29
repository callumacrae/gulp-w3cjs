var es = require("event-stream");

module.exports = function (param) {
	"use strict";

	// see "Writing a plugin"
	// https://github.com/wearefractal/gulp/wiki/Writing-a-gulp-plugin
	function w3c-validate(file, callback) {

		// if necessary check for required param(s), e.g. options hash, etc.
		if (!param) {
			callback(new Error("gulp-w3c-validate: No param supplied"), undefined);
		}

		// check if file.contents is a `Buffer`
		if (file.contents instanceof Buffer) {

			// manipulate buffer in some way
			// http://nodejs.org/api/buffer.html
			file.contents = new Buffer(String(file.contents) + "\n" + param);

			callback(null, file);

		} else { // assume it is a `stream.Readable`

			// http://nodejs.org/api/stream.html
			// http://nodejs.org/api/child_process.html
			// https://github.com/dominictarr/event-stream

			// accepting streams is optional
			callback(new Error("gulp-w3c-validate: streams not supported"), undefined);
		}
	}

	return es.map(w3c-validate);
};
