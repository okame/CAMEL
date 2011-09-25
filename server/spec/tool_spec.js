var env = require('../lib/env').env;
var tool = require('../lib/tool').tool;
var Pack = require('../lib/pack').Pack;
var util = require('util');

describe('tool object test', function() {

	describe('on "parseRequest" method', function() {
		it('if full arguments.', function() {
			var arg = '{"ope":"get", "arg":"message"}';	
			var expectResult = tool.parseRequest(arg);
			expect(expectResult.ope).toEqual('get');
			expect(expectResult.data).toEqual('message');
		});
		it('if data is null.', function() {
			var arg = '{"ope":"", "arg":""}';	
			var expectResult = tool.parseRequest(arg);
			expect(expectResult.ope).toEqual('');
			expect(expectResult.data).toEqual('');
		});
	});

	describe('on "checkPackStatus" method', function() {
		var packs = {};

		packs[0] = new Pack();
		packs[1] = new Pack();
		packs[2] = new Pack();
		packs[3] = new Pack();
			
		packs[0].status = env.PACK_STATUS.READY_OK;
		packs[1].status = env.PACK_STATUS.READY_OK;
		packs[2].status = env.PACK_STATUS.READY_OK;
		packs[3].status = env.PACK_STATUS.READY_OK;

		it('is true. if status is ready.', function() {

			expect(tool.checkPackStatus(packs, 'READY_OK')).toEqual(true);
		});

		it('is false. if status is not same each other.', function() {
			packs[0].status = env.PACK_STATUS.MOVE;
	
			expect(tool.checkPackStatus(packs, 'READY_OK')).toEqual(false);
		});
	});

	describe('on "sumPackNum" method', function() {
		var packs = {}
		  , packNum = 4
		  , i;

		for(i = 0; i < packNum; i++) {
			packs[i] = new Pack();
		}

		it('is correct summation.', function() {
			expect(tool.sumPackNum(packs)).toEqual(packNum);
		});
	});
});
