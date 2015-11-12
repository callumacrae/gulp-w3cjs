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
function handleMessages(file, messages, options) {
	var success = true;
	var errorText = gutil.colors.red.bold('HTML Error:');
	var warningText = gutil.colors.yellow.bold('HTML Warning:');
	var infoText = gutil.colors.green.bold('HTML Info:');
	var lines = file.contents.toString().split(/\r\n|\r|\n/g);

	if (!Array.isArray(messages)) {
		gutil.log(warningText, 'Failed to run validation on', file.relative);

		// Not sure whether this should be true or false
		return true;
	}

	messages.forEach(function (message) {
		if (message.type === 'info' && !options.showInfo) {
			return;
		}

		if (message.type === 'error') {
			success = false;
		}

		var type = (message.type === 'error') ? errorText : ((message.type === 'info') ? infoText : warningText);

		var location = 'Line ' + (message.lastLine || 0) + ', Column ' + (message.lastColumn || 0) + ':';

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

		if (typeof(message.lastLine) !== 'undefined' || typeof(lastColumn) !== 'undefined') {
			gutil.log(type, file.relative, location, message.message);
		} else {
			gutil.log(type, file.relative, message.message);
		}

		if (erroredLine) {
			gutil.log(erroredLine);
		}
	});

	return success;
}

function reporter() {
	return through.obj(function(file, enc, cb) {
        cb(null, file);
        if (file.w3cjs && !file.w3cjs.success) {
            throw new gutil.PluginError('gulp-w3cjs', 'HTML validation error(s) found');
        }
    });
}

module.exports = function (options) {
	options = options || {};

	// I typo'd this and didn't want to break BC
	if (typeof options.uri === 'string') {
		options.url = options.uri;
	}

	if (typeof options.url === 'string') {
		w3cjs.setW3cCheckUrl(options.url);
	}

	return through.obj(function (file, enc, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			return callback(new gutil.PluginError('gulp-w3cjs', 'Streaming not supported'));
		}

		w3cjs.validate({
			proxy: options.proxy ? options.proxy : undefined,
			input: file.contents,
			callback: function (res) {
				file.w3cjs = {
					success: handleMessages(file, res.messages, options),
					messages: res.messages
				};

				callback(null, file);
			}
		});
	});
};

module.exports.reporter = reporter;
module.exports.setW3cCheckUrl = w3cjs.setW3cCheckUrl;
