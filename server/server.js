var packSrv = {};

// change to local variables
packSrv.sys        = require('sys');
util = require('util');
var WebSocketServer    = require('websocket').server;
var http = require('http');
packSrv.json       = require('./lib/json2');
packSrv.Pack       = require('./lib/pack').Pack;
packSrv.env        = require('./lib/env').env;
packSrv.tool = require('./lib/tool').tool;
packSrv.stage      = require('./lib/stage').stage;
packSrv.referee    = require('./lib/referee').referee;
packSrv.packs      = {};
packSrv.turnNumber = 0;
packSrv.idCnt      = 0;
packSrv.rate       = packSrv.env.FRAME_RATE;

// make websocket server
var http = require('http').createServer (
	function(request, response) {
		console.log('hoge');
		response.writeHead(404);
		response.end();
	}
);

var port = 8000;

http.listen(port, function() {
		console.log('server listening on port ' + port +'.');
});

var wsParam = {
	 httpServer : http
	,autoAcceptConnections : true
};

WebSocketServer.prototype.broadcast = function(msg) {
	this.connections.forEach(function(connection, i, arry){
			connection.sendUTF(msg);
		});
}

packSrv.sv = new WebSocketServer(wsParam);

//manage packman ID
//manage to finish execution

packSrv.sys.log(packSrv.env.PACK_NUM);

/*
 * initialize function
 */
packSrv.init = function() {
	var that = this;
	var env = this.env;

	// create stage
	this.stage.init();
	this.stage.createPList();

	// ope
	this.operations = {
		echo : function() {
			that.sys.log('call echo');
		},

		// event start
		evs : function(con) {
			//that.timer = setInterval(packSrv.evLoop, that.rate);
		},

		// event stop
		eve : function() {
			clearInterval(that.timer);
		},

		// Initialize client
		clientInit : function(con) {
			var i, id, packNum, finished, pack, usrInfo = {};
			id = that.idCnt;
			that.sys.log('Called clientInit');

			if( id < env.PACK_NUM ) {
				usrInfo.score = '0';
				usrInfo.id = id;
				that.idCnt++;

				//create packman object
				pack = new that.Pack(con);
				pack.send('init', usrInfo);
				that.sys.log('create packman object(id='+id+')');
				that.packs[id] = pack;
				that.packs[id].setId(id);
				that.sys.log('push pack[id='+pack.getId()+']');

				//Check first connection of all client
				finished = that.tool.checkPackStatus(that.packs, 'CLIENT_INIT', true);
				packNum = that.tool.sumPackNum(that.packs);
				if(packNum == env.PACK_NUM && finished){

					//broadcast to send stage information
					that.sys.log('#######client ready phase#######');
					env.stage = that.stage.cells;
					env.packs = [];
					for(i=0; i<env.PACK_NUM; i++) {
						env.packs[i] = that.packs[i].createPackGhost();
					}
					that.sv.broadcast(that.tool.createMsg('ready', env));

					// Initialize referee object by packs and stage.
					that.referee.init(that.packs, that.stage);
				}
			}else{
				that.sys.log('[Error]fail connection. This id is already used.');
			}

		},

		readyOk : function(con, msg) {
			var id = msg.id, finished;
			that.sys.log('readyOk(id='+id+')');
			that.packs[id].status = env.PACK_STATUS.READY_OK;

			finished = that.tool.checkPackStatus(that.packs, 'READY_OK', true);
			if(finished){

				that.sys.log('start after 1 min.');
				that.sv.broadcast(that.tool.createMsg('start', ''));
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
			that.sys.log('move(id='+id+')(x='+x+',y='+y+')');

			// Check next cell
			if(that.referee.checkNextCell(id, x, y)){
				// Move pack to next cell
				that.movePackmanForStage(id,x,y);
				that.packs[id].isWall = false;
				that.packs[id].move(msg);
			} else {
				that.packs[id].isWall = true;
			}

			that.packs[id].status = env.PACK_STATUS.MOVE;
			finished = that.tool.checkPackStatus(that.packs, 'MOVE', false);

			if(finished){
				for(i=0; i<env.PACK_NUM; i++){
					that.packs[id].status = env.PACK_STATUS.TURN_END;
				}
				packSrv.turnEnd();
			}
		}
	}

	//add listener
	this.sv.on('connect', function(con) {
			var i = 0, j = 0, that = packSrv;
			//that.sys.log('con.id='+con.config.httpServer.connections);

			con.on('message', function(msg){
					var req = that.tool.parseRequest(msg.utf8Data);
					if(req && that.operations[req.ope]) {
						that.operations[req.ope](con, req.data);
					} else {
						that.sys.log('Recieve invalid massge');
						con.sendUTF('Invalid massge');
					}
				});
		});

	this.sys.puts('Server running');
	this.sys.log('#######sys phase#######');
};

packSrv.movePackmanForStage = function(id,x,y){
	var pack = packSrv.packs[id];
	var env = this.env;
	this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.PACK] = this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.PACK] - Math.pow(2,id);
	this.stage.cells[x][y][env.STAGE_OBJECTS.PACK] = this.stage.cells[x][y][env.STAGE_OBJECTS.PACK] + Math.pow(2,id);
}

/**
 * Turn end processing.
 */
packSrv.turnEnd = function(){
	var packs = this.packs;
	//this.sys.log('turnEnd():turn number='+packSrv.turnNumber);

	this.referee.calcPoint();
	this.referee.printPoint();

	//encounter enemy
	//no implement(end of turn of all packman)
	
	for(var id in packs) {
		packs[id].send('scr', packs[id].point);
	}

	console.log('pListNum:'+this.stage.getPListLength());

	packSrv.turnNumber++;
}

/*
 * start event loop
 */
packSrv.startEventLoop = function(){
	this.sys.log('start event loop.');
	this.timer = setInterval(packSrv.evLoop, this.rate);
}

/*
 * Event Loop
 */
packSrv.evLoop = function() {
	var packs = packSrv.packs;
	var env = packSrv.env;
	var msg = {};

	//TODO:change broadcast message(kondo)
	for(var id in packs) {
		packSrv.sys.log(packs[id].getX()+','+packs[id].getY()+'(id='+packs[id].getId()+')');
		msg.cells = packSrv.stage.cells;
		msg.pack = packs[id].createPackGhost();
		msg.turn = packSrv.turnNumber;
		packs[id].next(msg);
		packs[id].render(packSrv.stage.cells);
	}

	if(packSrv.stage.feedsIsEmpty()) {
		clearInterval(packSrv.timer);
		msg.winner = packSrv.referee.judgeWinner();
		packSrv.sv.broadcast(packSrv.tool.createMsg('end', msg));
	}


}

packSrv.init();

