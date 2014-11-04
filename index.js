'use strict';

var es = require('event-stream'),
	w3cjs = require('w3cjs'),
	gutil = require('gulp-util'),
	path = require('path');

/**
 * Handles messages.
 *
 * @param file The file array.
 * @param messages Array of messages returned by w3cjs.
 * @return boolean Return false if errors have occurred.
 */
function handleMessages(file, messages) {
	var success = true,
		errorText = gutil.colors.red.bold('HTML Error:'),
		warningText = gutil.colors.yellow.bold('HTML Warning:'),
		lines = file.contents.toString().split(/\r\n|\r|\n/g);

	if (!Array.isArray(messages)) {
		gutil.log(warningText, 'Failed to run validation on', file.relative);
		return true; // Not sure whether this should be true or false
	}

	messages.forEach(function (message) {
		if (message.type === 'error') {
			success = false;
		}

		var type = (message.type === 'error') ? errorText : warningText,
			location = 'Line ' + message.lastLine + ', Column ' + message.lastColumn + ':';

		var erroredLine = lines[message.lastLine - 1];
		if (erroredLine) {//if not, stream was changed since validation
			var errorColumn = message.lastColumn;

			//trim before if the error is too late in the line
			if (errorColumn > 60) {
				erroredLine = erroredLine.slice(errorColumn - 50);
				errorColumn = 50;
			}

			//trim after so the line is not too long
			erroredLine = erroredLine.slice(0, 60);

			//highlight character with error
			erroredLine =
				gutil.colors.grey(erroredLine.substring(0, errorColumn - 1)) +
				gutil.colors.red.bold(erroredLine[ errorColumn - 1 ]) +
				gutil.colors.grey(erroredLine.substring(errorColumn));
		}

		gutil.log(type, file.relative, location, message.message);

		if (erroredLine) {
			gutil.log(erroredLine);
		}
	});

	return success;
}

module.exports = function (options) {
	options = options || {};

	return es.map(function (file, callback) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(new PluginError('gulp-w3cjs', 'Streaming not supported'));
		}

		w3cjs.validate({
			input: file.contents,
			callback: function (res) {
				file.w3cjs = {
					success: handleMessages(file, res.messages),
					messages: res.messages
				};

				callback(null, file);
			},

			doctype: options.doctype,
			charset: options.charset
		});
	});
};
