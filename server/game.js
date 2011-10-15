var game = {};

var hoge = {};

var createServer    = require('./lib/server').createServer
, util            = require('util')
, WebSocketServer = require('websocket').server
, http            = require('http')
, util            = require('util')
, Pack            = require('./lib/pack').Pack
, env             = require('./lib/env').env
, tool            = require('./lib/tool').tool
, stage           = require('./lib/stage').stage
, referee         = require('./lib/referee').referee
, packs           = {}
, turnNumber      = 0
, idCnt           = 0
, loopLock = false
, endFrame = Math.floor(env.GAME_TIME * 60 * 1000 / env.FRAME_RATE);
console.log(endFrame);
 
/*
 * initialize function
 */
game.init = function() {
	var that = this;

	// WebSocketServer作成
	this.sv = createServer(this.connectEvnt, this.closeEvnt, this.messageEvnt);

	// stage作成
	stage.init();
	env.stage = stage.cells;

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
				pack.send('init', {usrInfo:usrInfo, env:env});
				util.log('clientInit(id='+id+')');

				//Check first connection of all client
				finished = tool.checkPackStatus(packs, 'CLIENT_INIT');
				if(tool.sumPackNum(packs) == env.PACK_NUM && finished){
					env.packs = [];
					for(i=0; i<env.PACK_NUM; i++) {
						env.packs[i] = packs[i].createPackGhost();
					}

					referee.init(packs, stage);
					that.sv.broadcast(tool.createMsg('ready', env));
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
			, x = msg.j
			, y = msg.i
			, finished
			, feedBack;

			packs[id].feedBack = referee.checkNextCell(id, x, y)

			if(packs[id].feedBack == env.FEED_BACK.SUCS){
				console.log('[id:'+id+']',x,y);
				packs[id].move(msg);
			} else {
				packs[id].isWall = true;
			}

			packs[id].changeState(env.PACK_STATUS.MOVE);
			finished = tool.checkPackStatus(packs, 'MOVE');

			if(finished){
				for(i=0; i<env.PACK_NUM; i++){
					packs[i].changeState(env.PACK_STATUS.TURN_END);
				}
				game.turnEnd();
			}
		}
	}

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

	turnNumber++;
	referee.calcPoint(turnNumber);
	//referee.printPoint();

	
	for(var id in packs) {
		packs[id].send('scr', packs[id].point);
		packs[id].render(stage.cells);
	}

	console.log('--- turn end : '+turnNumber+' ---');
	console.log();
	loopLock = false;
}

/**
 * Event Loop
 */
game.evLoop = function() {

	if(loopLock) {
		console.log('LOCKED! [loopLock]');
		return;
	}

	var finReady = tool.checkPackStatus(packs, 'READY_OK', false);
	var finTurn = tool.checkPackStatus(packs, 'TURN_END', false);

	if(!(finReady || finTurn)) {
		console.log('LOCKED! ['+(finReady? 'READY_OK':'TURN_END')+']');
		return;
	}

	loopLock = true;

	console.log('--- evLoop : '+turnNumber+' ---');
	var msg = {};

	for(var id in packs) {
		//util.log(packs[id].getX()+','+packs[id].getY()+'(id='+id+')');
		msg.cells = stage.cells;
		msg.pack = packs[id].createPackGhost();
		msg.turn = turnNumber;
		packs[id].next(msg);
	}

	// check game end.
	if(stage.feedsIsEmpty() || turnNumber >= endFrame) {
		clearInterval(game.timer);
		msg.winner = referee.judgeWinner();
		game.sv.broadcast(tool.createMsg('end', msg));
	}
}

game.init();

