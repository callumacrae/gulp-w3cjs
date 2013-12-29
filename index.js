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
		warningText = gutil.colors.yellow.bold('HTML Warning:');

	messages.forEach(function (message) {
		if (message.type === 'error') {
			success = false;
		}

		var type = (message.type === 'error') ? errorText : warningText,
			location = 'Line ' + message.lastLine + ', Column ' + message.lastColumn + ':';

		gutil.log(type, file.relative, location, message.message);
	});

	return success;
}

module.exports = function () {
	return es.map(function (file, callback) {
		w3cjs.validate({
			file: file.path,
			callback: function (res) {
				file.w3cjs = {
					success: handleMessages(file, res.messages),
					messages: res.messages
				};

				callback(null, file);
			}
		});
	});
};
