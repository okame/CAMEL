var game = {};

var createServer    = require('./lib/server').createServer;
var util            = require('util');
var WebSocketServer = require('websocket').server;
var http            = require('http');
var util            = require('util');
var Pack            = require('./lib/pack').Pack;
var env             = require('./lib/env').env;
var tool            = require('./lib/tool').tool;
var stage           = require('./lib/stage').stage;
var referee         = require('./lib/referee').referee;
var packs           = {};
var turnNumber      = 0;
var idCnt           = 0;


game.moduleInit = function() {
	stage.init();
	referee.init(packs, stage);
	this.sv = createServer();
}

/*
 * initialize function
 */
game.init = function() {
	var that = this;

	// ope
	this.operations = {

		// Initialize client
		clientInit : function(con) {
			var i, id, packNum, finished, pack, usrInfo = {};

			if( idCnt < env.PACK_NUM ) {
				//create packman object
				id = idCnt++;
				pack = new Pack(con, id);
				packs[id] = pack;
				pack.changeState(env.PACK_STATUS.CLIENT_INIT);
				usrInfo = { score:0 ,id:id ,state:'CLIENT_INIT' };
				pack.send('init', usrInfo);
				util.log('clientInit(id='+id+')');

				//Check first connection of all client
				finished = tool.checkPackStatus(packs, 'CLIENT_INIT', true);
				if(tool.sumPackNum(packs) == env.PACK_NUM && finished){
					env.stage = stage.cells;
					env.packs = [];
					for(i=0; i<env.PACK_NUM; i++) {
						env.packs[i] = packs[i].createPackGhost();
					}
					that.sv.broadcast(tool.createMsg('ready', env));
					that.moduleInit();
				}
			}else{
				util.log('[Error] game is full.');
			}

		},

		readyOk : function(con, msg) {
			var id = msg.id, finished;
			util.log('readyOk(id='+id+')');
			packs[id].changeState(env.PACK_STATUS.READY_OK);

			finished = tool.checkPackStatus(packs, 'READY_OK');
			if(finished){
				that.sv.broadcast(tool.createMsg('start'));
				that.timer = setInterval(game.evLoop, env.FRAME_RATE);
			}

		},

		// move pack
		move : function(con, msg) {
			var id = msg.id
			, x = msg.i
			, y = msg.j
			, finished
			, success;

			//util.log('move(id='+id+')(x='+x+',y='+y+')');

			if(referee.checkNextCell(id, x, y)){
				packs[id].move(msg);
			} else {
				packs[id].isWall = true;
			}

			packs[id].changeState(env.PACK_STATUS.MOVE);
			finished = tool.checkPackStatus(packs, 'MOVE', false);

			if(finished){
				for(i=0; i<env.PACK_NUM; i++){
					packs[id].changeState(env.PACK_STATUS.TURN_END);
				}
				game.turnEnd();
			}
		}
	}

	// WebSocketServer作成
	this.sv = createServer(this.connectEvnt, this.closeEvnt, this.messageEvnt);

};

game.connectEvnt = function(con) {
	util.log('connect.');
}

game.closeEvnt = function(con) {
	util.log('close.');
}

game.messageEvnt = function(con, msg) {
	var req = tool.parseRequest(msg.utf8Data);
	if(req && game.operations[req.ope]) {
		game.operations[req.ope](con, req.data);
	} else {
		util.log('Recieve invalid massge');
	}
}

/**
 * Turn end processing.
 */
game.turnEnd = function(){

	referee.calcPoint();
	referee.printPoint();

	for(var id in packs) {
		packs[id].send('scr', packs[id].point);
	}

	turnNumber++;
}

/**
 * Event Loop
 */
game.evLoop = function() {
	var msg = {};

	for(var id in packs) {
		util.log(packs[id].getX()+','+packs[id].getY()+'(id='+id+')');
		msg.cells = stage.cells;
		msg.pack = packs[id].createPackGhost();
		msg.turn = turnNumber;
		packs[id].next(msg);
		packs[id].render(stage.cells);
	}

	// check game end.
	if(stage.feedsIsEmpty()) {
		clearInterval(game.timer);
		msg.winner = referee.judgeWinner();
		game.sv.broadcast(tool.createMsg('end', msg));
	}
}

game.init();

