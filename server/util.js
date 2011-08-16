/**
 * Utility methods
 */
exports.util = {};

var util = exports.util;

util.parseRequest = function(msg) {
	var msgb = JSON.parse(msg);
	req = {};
	req.ope  = msgb.ope;
	req.data = msgb.arg || '';
	return req;
}

util.createMsg = function(ope, arg) {

	var msg = {
		ope:ope,
		arg:arg
	};

	return JSON.stringify(msg);
}


