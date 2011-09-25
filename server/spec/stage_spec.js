var env = require('../lib/env').env;
var stage = require('../lib/stage').stage;
var util = require('util');

describe('stage object test.', function() {
	stage.init();
	stage.debug();
	describe('createPList method.', function() {
		it('is ok.', function() {
			stage.createPList();
			expect(60).toEqual(stage.pList.length);
		});
	});
});

