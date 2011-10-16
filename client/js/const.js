/**
 * const.js
 *
 * dep :
 */

CONSTANT = {};

(function($) {

 	CONSTANT.SERVER = {
		PORT : '8000'
		, HOST : 'localhost'
	}

	CONSTANT.DIR = {
		 UP : 0
		,DOWN : 1
		,LEFT :2
		,RIGTH : 3
	},

	CONSTANT.MOUTH = {
		MASTER : 'm'
		, SMALL : 's'
		, LARGE : 'l'
	}

	CONSTANT.COLOR = {
		Yellow : 'y'
		, Aquamarine : 'b'
		, LightPink : 'r'
		, Green : 'g'
		, Gray : 'gr'
	}

	CONSTANT.BLOCK= {
		H : 0
		, V : 1
		, LU : 2
		, RU : 3
		, LD : 4
		, RD : 5
	}

 })($);
