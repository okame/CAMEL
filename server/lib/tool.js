/**
 * Utility methods
 */

/* Load library */
var sys = require('sys');
var env = require('./env').env;

var tool = {};

tool.parseRequest = function(msg) {
	var msgb = JSON.parse(msg);
	req = {};
	req.ope  = msgb.ope;
	req.data = msgb.arg || '';
	return req;
}

tool.createMsg = function(ope, arg) {

	var msg = {
		ope:ope,
		arg:arg
	};

	return JSON.stringify(msg);
}

/**
 * Check pack's status.
 * If all pack's status equals status(argument),
 * return true, otherwise return false.
 */
tool.checkPackStatus = function(packs, status, logSw) {
	var id
	, result = true;

	for(id in packs){
		if( packs[id].status != env.PACK_STATUS[status]){
			if(logSw) console.log('pack[' + id + '] is not ' + status + '.');
			result = false;
		}
	}
	return result;
}

/**
 * Return sumation of packs.
 */
tool.sumPackNum = function(packs) {
	var key, sum = 0;
	for(key in packs) {
		if(packs.hasOwnProperty(key)) {
			sum++;
		}
	}
	return sum;
}


//-----------------------
exports.tool = tool;
