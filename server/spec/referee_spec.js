/*
 * 毎回calcPointが呼ばれてるかturnEndとすりあわせて確認
 */

var env = require('../lib/env').env;
var referee = require('../lib/referee').referee;
var stage = require('../lib/stage').stage;
var Pack = require('../lib/pack').Pack;
var util = require('util');

describe('referee object test.', function() {
	var packs = []
	, packNum = 4
	, i = 0;

	for(i; i<packNum; i++) {
		packs[i] = new Pack()
		packs[i].point = 0;
		packs[i].x = 0;
		packs[i].y = 0;
		packs[i].id = i;
	}

	stage.init();
	stage.debug();
	referee.init(packs, stage);

	describe('judgeWinner method.', function() {
		it('is pack3.', function() {
			packs[0].point = 0;
			packs[1].point = 1;
			packs[2].point = 3;
			packs[3].point = 2;
			var winner = referee.judgeWinner();
			expect('2').toEqual(winner.id);
		});
		it('is pack2.', function() {
			packs[0].point = 0;
			packs[1].point = 4;
			packs[2].point = 3;
			packs[3].point = 2;
			var winner = referee.judgeWinner();
			expect('1').toEqual(winner.id);
		});
	});

	describe('calcPoint method.', function() {
		var testId0 = 0
		, testId1 = 1
		, testId2 = 2
		, testId3 = 3
		it('get points.', function() {
			packs[testId0].x = 2, packs[testId0].y = 5, packs[testId0].point = 0;
			stage.cells[2][5][env.STAGE_OBJECTS.PACK] = Math.pow(2, testId0);
			stage.cells[2][5][env.STAGE_OBJECTS.FEED] = 2;
			referee.calcPoint();
			expect(2).toEqual(packs[testId0].point);
		});
		it('devide points.', function() {
			packs[testId0].x = 2, packs[testId0].y = 5, packs[testId0].point = 0;
			packs[testId1].x = 2, packs[testId1].y = 5, packs[testId1].point = 0;
			stage.cells[2][5][env.STAGE_OBJECTS.PACK] 
				= Math.pow(2, testId0) + Math.pow(2, testId1);
			stage.cells[2][5][env.STAGE_OBJECTS.FEED] = 2;
			referee.calcPoint();
			expect(1).toEqual(packs[testId0].point);
			expect(1).toEqual(packs[testId1].point);
		});
		it('devide points at 2 postitions.', function() {
			packs[testId0].x = 2, packs[testId0].y = 5, packs[testId0].point = 0;
			packs[testId1].x = 2, packs[testId1].y = 5, packs[testId1].point = 0;
			packs[testId2].x = 4, packs[testId2].y = 7, packs[testId2].point = 0;
			packs[testId3].x = 4, packs[testId3].y = 7, packs[testId3].point = 0;
			stage.cells[2][5][env.STAGE_OBJECTS.PACK] 
				= Math.pow(2, testId0) + Math.pow(2, testId1);
			stage.cells[2][5][env.STAGE_OBJECTS.FEED] = 2;
			stage.cells[4][7][env.STAGE_OBJECTS.PACK] 
				= Math.pow(2, testId2) + Math.pow(2, testId3);
			stage.cells[4][7][env.STAGE_OBJECTS.FEED] = 2;
			referee.calcPoint();
			expect(1).toEqual(packs[testId0].point);
			expect(1).toEqual(packs[testId1].point);
			expect(1).toEqual(packs[testId2].point);
			expect(1).toEqual(packs[testId3].point);
		});
		it('devide points at same postision of all packs.', function() {
			packs[testId0].x = 2, packs[testId0].y = 5, packs[testId0].point = 0;
			packs[testId1].x = 2, packs[testId1].y = 5, packs[testId1].point = 0;
			packs[testId2].x = 2, packs[testId2].y = 5, packs[testId2].point = 0;
			packs[testId3].x = 2, packs[testId3].y = 5, packs[testId3].point = 0;
			stage.cells[2][5][env.STAGE_OBJECTS.PACK] 
				= Math.pow(2, testId0) + Math.pow(2, testId1) + Math.pow(2, testId2) + Math.pow(2, testId3);
			stage.cells[2][5][env.STAGE_OBJECTS.FEED] = 4;
			referee.calcPoint();
			expect(1).toEqual(packs[testId0].point);
			expect(1).toEqual(packs[testId1].point);
			expect(1).toEqual(packs[testId2].point);
			expect(1).toEqual(packs[testId3].point);
		});
	});
});

