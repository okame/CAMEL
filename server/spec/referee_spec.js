var env = require('../lib/env').env;
var referee = require('../lib/referee').referee;
var stage = require('../lib/stage').stage;
var Pack = require('../lib/pack').Pack;
var util = require('util');

describe('referee object test.', function() {
	var packs = []
	, pack1 = new Pack()
	, pack2 = new Pack()
	, pack3 = new Pack()
	, pack4 = new Pack();

	packs.push(pack1);
	packs.push(pack2);
	packs.push(pack3);
	packs.push(pack4);

	stage.init();
	stage.debug();
	referee.init(packs, stage);

	describe('judgeWinner method.', function() {
		it('is pack3.', function() {
			pack1.point = 0;
			pack2.point = 1;
			pack3.point = 3;
			pack4.point = 2;
			var winner = referee.judgeWinner();
			expect('2').toEqual(winner.id);
		});
		it('is pack2.', function() {
			pack1.point = 0;
			pack2.point = 4;
			pack3.point = 3;
			pack4.point = 2;
			var winner = referee.judgeWinner();
			expect('1').toEqual(winner.id);
		});
	});
});

