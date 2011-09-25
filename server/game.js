var packSrv = {};

var server = require('./lib/server').server;
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

packSrv.sv = server();

/*
 * initialize function
 */
packSrv.init = function() {
	var that = this;

	// create stage
	stage.init();
	stage.createPList();

	// ope
	this.operations = {
		echo : function() {
			util.log('call echo');
		},

		// Initialize client
		clientInit : function(con) {
			var i, id, packNum, finished, pack, usrInfo = {};
			id = idCnt;
			util.log('Called clientInit');

			if( id < env.PACK_NUM ) {
				usrInfo.score = '0';
				usrInfo.id = id;
				usrInfo.state = 'CLIENT_INIT';
				idCnt++;

				//create packman object
				pack = new Pack(con);
				pack.send('init', usrInfo);
				util.log('create packman object(id='+id+')');
				packs[id] = pack;
				packs[id].setId(id);
				util.log('push pack[id='+pack.getId()+']');

				//Check first connection of all client
				finished = tool.checkPackStatus(packs, 'CLIENT_INIT', true);
				packNum = tool.sumPackNum(packs);
				if(packNum == env.PACK_NUM && finished){

					//broadcast to send stage information
					util.log('#######client ready phase#######');
					env.stage = stage.cells;
					env.packs = [];
					for(i=0; i<env.PACK_NUM; i++) {
						env.packs[i] = packs[i].createPackGhost();
					}
					that.sv.broadcast(tool.createMsg('ready', env));

					// Initialize referee object by packs and stage.
					referee.init(packs, stage);
				}
			}else{
				util.log('[Error]fail connection. This id is already used.');
			}

		},

		readyOk : function(con, msg) {
			var id = msg.id, finished;
			util.log('readyOk(id='+id+')');
			packs[id].status = env.PACK_STATUS.READY_OK;
			packs[id].send('state', 'READY_OK');

			finished = tool.checkPackStatus(packs, 'READY_OK', true);
			packs[id].send('state', 'READY_OK');
			if(finished){

				util.log('start after 1 min.');
				that.sv.broadcast(tool.createMsg('start', ''));
				setTimeout(packSrv.startEventLoop(),2000); //TODO:change 1min
			}

		},

		// move pack
		move : function(con, msg) {
			var id = msg.id;
			var x = msg.i;
			var y = msg.j;
			var finished;
			var success;
			util.log('move(id='+id+')(x='+x+',y='+y+')');

			// Check next cell
			if(referee.checkNextCell(id, x, y)){
				// Move pack to next cell
				that.movePackmanForStage(id,x,y);
				packs[id].isWall = false;
				packs[id].move(msg);
			} else {
				packs[id].isWall = true;
			}

			packs[id].status = env.PACK_STATUS.MOVE;
			packs[id].send('state', 'MOVE');
			finished = tool.checkPackStatus(packs, 'MOVE', false);

			if(finished){
				for(i=0; i<env.PACK_NUM; i++){
					packs[id].status = env.PACK_STATUS.TURN_END;
					packs[id].send('state', 'TURN_END');
				}
				packSrv.turnEnd();
			}
		}
	}

	//add listener
	this.sv.on('connect', function(con) {
			var i = 0, j = 0, that = packSrv;

			con.on('message', function(msg){
					var req = tool.parseRequest(msg.utf8Data);
					if(req && that.operations[req.ope]) {
						that.operations[req.ope](con, req.data);
					} else {
						util.log('Recieve invalid massge');
						con.sendUTF('Invalid massge');
					}
				});
		});

	util.log('Server running');
	util.log('#######sys phase#######');
};

packSrv.movePackmanForStage = function(id,x,y){
	var pack = packs[id];
	stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.PACK] = stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.PACK] - Math.pow(2,id);
	stage.cells[x][y][env.STAGE_OBJECTS.PACK] = stage.cells[x][y][env.STAGE_OBJECTS.PACK] + Math.pow(2,id);
}

/**
 * Turn end processing.
 */
packSrv.turnEnd = function(){

	referee.calcPoint();
	referee.printPoint();

	//encounter enemy
	//no implement(end of turn of all packman)
	
	for(var id in packs) {
		packs[id].send('scr', packs[id].point);
	}

	turnNumber++;
}

/**
 * start event loop
 */
packSrv.startEventLoop = function(){
	util.log('start event loop.');
	this.timer = setInterval(packSrv.evLoop, env.FRAME_RATE);
}

/**
 * Event Loop
 */
packSrv.evLoop = function() {
	var msg = {};

	for(var id in packs) {
		util.log(packs[id].getX()+','+packs[id].getY()+'(id='+packs[id].getId()+')');
		msg.cells = stage.cells;
		msg.pack = packs[id].createPackGhost();
		msg.turn = turnNumber;
		packs[id].next(msg);
		packs[id].render(stage.cells);
	}

	// check game end.
	if(stage.feedsIsEmpty()) {
		clearInterval(packSrv.timer);
		msg.winner = referee.judgeWinner();
		packSrv.sv.broadcast(tool.createMsg('end', msg));
	}


}

packSrv.init();

