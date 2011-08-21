var packSrv = {};

(function() {

		// change to local variables
		packSrv.sys        = require('sys');
		packSrv.http       = require('http');
		packSrv.ws         = require('websocket-server');
		packSrv.json       = require('./json2');
		packSrv.Pack       = require('./pack').Pack;
		packSrv.env        = require('./env').env;
		packSrv.util       = require('./util').util;
		packSrv.stage      = require('./stage').stage;
		packSrv.referee    = require('./referee').referee;
		packSrv.sv         = packSrv.ws.createServer();
		packSrv.packs      = {};
		packSrv.turnNumber = 0;
		packSrv.idCnt      = 0;
		packSrv.rate       = packSrv.env.FRAME_RATE;
		packSrv.sv.listen(8000);

		//manage packman ID
		var packmanidArray = [];
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
					var i, id, packNum, finished, pack;
					id = that.idCnt;
					that.sys.log('Called clientInit');

					if( packmanidArray[con.id] != null || id <= env.PACK_NUM ) {
						packmanidArray[con.id] = id;
						that.idCnt++;

						//create packman object
						pack = new that.Pack(con, env.DEFAULT_PACK_X, env.DEFAULT_PACK_Y);
						that.sys.log('create packman object(id='+id+')');
						that.packs[id] = pack;
						that.packs[id].setId(id);
						that.sys.log('push pack[id='+pack.getId()+']');

						//Check first connection of all client
						finished = that.util.checkPackStatus(that.packs, 'CLIENT_INIT', true);
						packNum = that.util.sumPackNum(that.packs);
						if(packNum == env.PACK_NUM && finished){

							//broadcast to send stage information
							that.sys.log('#######client ready phase#######');
							env.stage = that.stage.cells;
							env.packs = [];
							for(i=0; i<env.PACK_NUM; i++) {
								env.packs[i] = that.packs[i].createPackGhost();
							}
							that.sv.broadcast(that.util.createMsg('ready', env));

							// Initialize referee object by packs and stage.
							that.referee.init(that.packs, that.stage);
						}
					}else{
						that.sys.log('[Error]fail connection. This id is already used.');
					}

				},

				readyOk : function(con) {
					var id = packmanidArray[con.id], finished;
					that.sys.log('readyOk(id='+id+')');
					that.packs[id].status = env.PACK_STATUS.READY_OK;

					finished = that.util.checkPackStatus(that.packs, 'READY_OK', true);
					if(finished){

						that.sys.log('start after 1 min.');
						that.sv.broadcast(that.util.createMsg('start', ''));
						setTimeout(packSrv.startEventLoop(),2000); //TODO:change 1min
					}

				},

				// move pack
				move : function(con, msg) {
					var id = packmanidArray[con.id];
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
					finished = that.util.checkPackStatus(that.packs, 'MOVE', false);

					if(finished){
						for(i=0; i<env.PACK_NUM; i++){
							that.packs[id].status = env.PACK_STATUS.TURN_END;
						}
						packSrv.turnEnd();
					}
				}
			}

			//add listener
			this.sv.addListener('connection', function(con) {
					var i = 0, j = 0, that = packSrv;
					that.sys.log('con.id='+con.id);

					con.addListener('message', function(msg){
							var req = that.util.parseRequest(msg);
							if(req && that.operations[req.ope]) {
								that.operations[req.ope](con, req.data);
							} else {
								that.sys.log('Recieve invalid massge');
								con.send('Invalid massge');
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
			this.sys.log('turnEnd():turn number='+packSrv.turnNumber);

			this.referee.calcPoint();
			this.referee.printPoint();

			//get item
			//no implement

			//encounter enemy
			//no implement(end of turn of all packman)

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
				packs[id].next(msg);
				packs[id].render(packSrv.stage.cells);
			}

		}

	})();

packSrv.init();

