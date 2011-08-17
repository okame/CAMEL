/**
 * Utility methods
 */

/* Load library */
var sys = require('sys');
var env = require('./env').env;

var util = {};

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

/**
 * Check pack's status.
 * If all pack's status equals status(argument),
 * return true, otherwise return false.
 */
util.checkPackStatus = function(packs, status, logSw) {
	var i, pack;
	var isFinish = true;

	if(logSw) sys.print( status + ' status = ');
	for(id in packs){
		if( packs[id].status == env.PACK_STATUS[status]){
			if(logSw) sys.print('1');
		}else{
			isFinish = false;
			if(logSw) sys.print('0');
		}
	}
	if(logSw) sys.print('\n');

	return isFinish;
}

/**
 * Return sumation of packs.
 */
util.sumPackNum = function(packs) {
	var key, sum = 0;
	for(key in packs) {
		if(packs.hasOwnProperty(key)) {
			sum++;
		}
	}

	return sum;
}


//-----------------------
exports.util = util;
