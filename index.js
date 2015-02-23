'use strict';

var through = require('through2');
var w3cjs = require('w3cjs');
var gutil = require('gulp-util');

/**
 * Handles messages.
 *
 * @param file The file array.
 * @param messages Array of messages returned by w3cjs.
 * @return boolean Return false if errors have occurred.
 */
function handleMessages(file, messages) {
	var success = true;
	var errorText = gutil.colors.red.bold('HTML Error:');
	var warningText = gutil.colors.yellow.bold('HTML Warning:');
	var lines = file.contents.toString().split(/\r\n|\r|\n/g);

	if (!Array.isArray(messages)) {
		gutil.log(warningText, 'Failed to run validation on', file.relative);

		// Not sure whether this should be true or false
		return true;
	}

	messages.forEach(function (message) {
		if (message.type === 'error') {
			success = false;
		}

		var type = (message.type === 'error') ? errorText : warningText;

		var location = 'Line ' + message.lastLine + ', Column ' + message.lastColumn + ':';

		var erroredLine = lines[message.lastLine - 1];

		// If this is false, stream was changed since validation
		if (erroredLine) {
			var errorColumn = message.lastColumn;

			// Trim before if the error is too late in the line
			if (errorColumn > 60) {
				erroredLine = erroredLine.slice(errorColumn - 50);
				errorColumn = 50;
			}

			// Trim after so the line is not too long
			erroredLine = erroredLine.slice(0, 60);

			// Highlight character with error
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

	return through.obj(function (file, enc, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			return callback(new gutil.PluginError('gulp-w3cjs', 'Streaming not supported'));
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
