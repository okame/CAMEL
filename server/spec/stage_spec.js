var env = require('../lib/env').env;
var stage = require('../lib/stage').stage;
var util = require('util');

describe('stage object test.', function() {
	stage.init();
	stage.debug();
	describe('createPList method.', function() {
		it('is 60 in case of debug.', function() {
			stage.createPList();
			expect(60).toEqual(stage.getPListLength());
		});
	});

	describe('get blocks from test text.', function() {
		var fileName
		, blocks;
		it('is success.', function() {
			fileName = './spec/test.txt'
			blocks = stage.getBlocksFromText(fileName);
			expect('1').toEqual(blocks[0][0]);
			expect('1').toEqual(blocks[1][1]);
			expect('0').toEqual(blocks[0][1]);
			expect('1').toEqual(blocks[1][0]);
		});
		it('is success.', function() {
			fileName = './lib/stage/normal.txt';
			blocks = stage.getBlocksFromText(fileName);
			expect('1').toEqual(blocks[0][0]);
			expect('0').toEqual(blocks[1][1]);
			expect('1').toEqual(blocks[2][2]);
		});
	});
});

