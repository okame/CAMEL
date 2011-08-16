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
		packSrv.sv         = packSrv.ws.createServer();
		packSrv.packs      = {};
		packSrv.turnNumber = 0;
		packSrv.idCnt      = 0;
		packSrv.rate       = packSrv.env.FRAME_RATE;
		packSrv.sv.listen(8000);

		var stage = {};
		//manage packman ID
		var packmanidArray = new Array();
		//manage to finish execution
		var checkFinishArray = new Array(packSrv.env.PACK_NUM);

		packSrv.sys.log(packSrv.env.PACK_NUM);


		/* 
		 * create stage function
		 */
		packSrv.createStage = function() {
			//param
			var env = this.env;

			//stage array initialize
			stage = [];
			for(i=0; i<env.STAGE_XSIZE; i++){
				stage[i] = [];
				for(j=0; j<env.STAGE_YSIZE; j++){
					stage[i][j] = [];
					for(k=0; k<env.STAGE_ZSIZE; k++){
						stage[i][j][k] = 0;
					}
				}
			}

			//create wall
			for(i=0; i<env.STAGE_XSIZE; i++){
				stage[i][0][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
				stage[i][env.STAGE_YSIZE-1][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
			}
			for(i=1; i<env.STAGE_YSIZE-1; i++){
				stage[0][i][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
				stage[env.STAGE_XSIZE-1][i][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
			}	

			//put point
			stage[2][1][env.STAGE_OBJECTS.FEED]=10;
			stage[3][1][env.STAGE_OBJECTS.FEED]=10;
			stage[18][1][env.STAGE_OBJECTS.FEED]=10;
			stage[10][10][env.STAGE_OBJECTS.FEED]=10;

			//debug by kondo
			for(i=0; i<env.STAGE_YSIZE; i++){
				for(j=0; j<env.STAGE_XSIZE; j++){
					this.sys.print(stage[j][i][0]);
				}
				this.sys.print('\n');
			}

			this.sys.log('finished to create stage');
		}

		/*
		 * initialize function
		 */
		packSrv.init = function() {
			// param
			var that = this;
			var env = this.env;

			//initialize
			for(i=0; i<env.PACK_NUM; i++){
				checkFinishArray[i] = false;
			}

			//create stage
			this.createStage();

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

				// synchronize
				syn : function(con) {
					var i,id;
					id = that.idCnt;
					that.sys.log('called syn(id='+id+')',env.PACK_NUM);

					if( packmanidArray[con.id] != null || id <= env.PACK_NUM || checkFinishArray[id] == false ) {
						packmanidArray[con.id] = id;
						that.idCnt++;
						checkFinishArray[id] = true;
						that.sys.log('synack(id='+id+')');
						con.send(that.util.createMsg('synack', ''));

						//create packman object
						var p = new that.Pack(con, env.DEFAULT_PACK_X, env.DEFAULT_PACK_Y);
						that.sys.log('create packman object(id='+id+')');
						that.packs[id] = p;
						that.packs[id].setId(id);
						that.sys.log('push pack[id='+p.getId()+']');

						//check first connection of all client
						var flag = that.checkFinish('syn');
						if(flag){
							//initialize
							for(i=0; i<env.PACK_NUM; i++){
								checkFinishArray[i] = false;
							}
							//broadcast to send stage information
							that.sys.log('#######prestart phase#######');
							/*
							var sendObj={};
							sendObj.stage = stage;
							sendObj.packs = [];
							*/
							env.stage = stage;
							env.packs = [];
							for(i=0; i<env.PACK_NUM; i++) {
								env.packs[i] = that.packs[i].createSendPack();
							}
							that.sv.broadcast( that.util.createMsg('prestart', env) );
						}
					}else{
						that.sys.log('[Error]fail connection.It already use this id?');
					}

				},

				// acknowledge
				ack : function(con) {
					var id = packmanidArray[con.id];
					that.sys.log('ack(id='+id+')');
					checkFinishArray[id] = true;

					var flag = that.checkFinish('ack');
					if(flag){
						//initialize
						for(i=0; i<env.PACK_NUM; i++){
							checkFinishArray[i] = false;
						}

						that.sys.log('start after 1 min.');
						that.sv.broadcast( that.util.createMsg('start', '') );
						setTimeout(packSrv.startEventLoop(),2000); //TODO:change 1min
					}

				},

				// move pack
				move : function(con, msg) {
					var id = packmanidArray[con.id];
					var x = msg.i;
					var y = msg.j;
					that.sys.log('move(id='+id+')(x='+x+',y='+y+')');

					var moveSuccessFlag = true;

					/*
					 * check to move to next step
					 */

					//check out of stage
					if( x > 0 && x < env.STAGE_XSIZE-1 && 
						y > 0 && y < env.STAGE_YSIZE-1 ){
						//OK	
					}else{
						that.sys.log('Cant move to out of stage.x='+x+',y='+y+'(id='+id+')');
						moveSuccessFlag = false;
					}

					//check wall
					if( moveSuccessFlag && stage[x][y][env.STAGE_OBJECTS.BLOCK]==env.BLOCK_EXIST_YES){
						//block
						that.sys.log('Cant move for block.x='+x+',y='+y+'(id='+id+')');
						moveSuccessFlag = false;
					}

					//check tonari no masu
					if( moveSuccessFlag && !that.checkNextStep(id,x,y) ){
						that.sys.log('No exist packman.(id='+id+')');
						moveSuccessFlag = false;
					}

					if(moveSuccessFlag){
						//execution to move
						that.movePackmanForStage(id,x,y);
						that.packs[id].move(msg);
					}

					checkFinishArray[id] = true;

					var flag = that.checkFinish('move');
					if(flag){
						//initialize
						for(i=0; i<env.PACK_NUM; i++){
							checkFinishArray[i] = false;
						}
						packSrv.turnEnd();
					}
				}
			}

			packSrv.movePackmanForStage = function(id,x,y){
				var pack = packSrv.packs[id];
				var env = this.env;
				stage[pack.x][pack.y][env.STAGE_OBJECTS.PACK] = stage[pack.x][pack.y][env.STAGE_OBJECTS.PACK] - Math.pow(2,id);
				that.sys.log('debug1='+stage[pack.x][pack.y][env.STAGE_OBJECTS.PACK]);
				stage[x][y][env.STAGE_OBJECTS.PACK] = stage[x][y][env.STAGE_OBJECTS.PACK] + Math.pow(2,id);
				that.sys.log('debug2='+stage[x][y][env.STAGE_OBJECTS.PACK]);
			}

			packSrv.turnEnd = function(){
				var env = this.env;
				that.sys.log('turnEnd():turn number='+packSrv.turnNumber);

				//calculate point
				for(i=0; i<env.PACK_NUM; i++){
					if(!checkFinishArray[i]){
						//no already calculate
						var pointDividePackmanIdArray = new Array();
						var pack = packSrv.packs[i];
						var packmanExist = stage[pack.x][pack.y][env.STAGE_OBJECTS.PACK];

						if(stage[pack.x][pack.y][env.STAGE_OBJECTS.FEED]==0){
							//no point
							checkFinishArray[i] = true;
							continue;
						}

						for(j=i; (packmanExist != 0) && (j<env.PACK_NUM); j++){
							if( ( packmanExist & Math.pow(2,j) ) != 0 ){
								packmanExist = packmanExist - Math.pow(2,j);
								pointDividePackmanIdArray[pointDividePackmanIdArray.length] = j;

							}
						}

						var point = stage[pack.x][pack.y][env.STAGE_OBJECTS.FEED];
						var dividePoint = 0;

						if(pointDividePackmanIdArray.length != 0){
							dividePoint = point / pointDividePackmanIdArray.length;
							that.sys.log('debug(dividePoint)='+dividePoint);
						}

						for( i in pointDividePackmanIdArray ){
							var id = pointDividePackmanIdArray[i];
							packSrv.packs[id].point = packSrv.packs[id].point + dividePoint;
							packSrv.packs[id].sumPoint = packSrv.packs[id].sumPoint + dividePoint;
							checkFinishArray[id] = true;
						}

						stage[pack.x][pack.y][env.STAGE_OBJECTS.FEED] = 0;
					}

				}
				//initialize
				for(i=0; i<env.PACK_NUM; i++){
					checkFinishArray[i] = false;
				}
				//debug
				for(i=0;i<env.PACK_NUM; i++){
					that.sys.log('point='+that.packs[i].point+'(id='+i+')');
				}

				//get item
				//no implement


				//encounter enemy
				//no implement(end of turn of all packman)

				packSrv.turnNumber++;
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

		/*
		 * check tonari no masu
		 */
		packSrv.checkNextStep = function(id,x,y){
			var pack = packSrv.packs[id];

			if( pack.x == x && pack.y == y || //same location
				pack.x-1 == x && pack.y == y ||
				pack.x == x && pack.y-1 == y ||
				pack.x+1 == x && pack.y == y ||
				pack.x == x && pack.y+1 == y){
				//OK
				return true;
			}else{
				//NG
				return false;
			}
		}

		/*
		 * check finish
		 */
		packSrv.checkFinish = function(msg){
			var flag = true;
			var env = this.env;

			this.sys.print( msg + ' status=');
			for(i=0; i<env.PACK_NUM; i++){
				if( checkFinishArray[i] ){
					this.sys.print('1');
				}else{
					flag = false;
					this.sys.print('0');
				}
			}
			this.sys.print('\n');

			return flag;
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

			//TODO:change broadcast message(kondo)
			for(var id in packs) {
				packSrv.sys.log(packs[id].getX()+','+packs[id].getY()+'(id='+packs[id].getId()+')');
				packs[id].next(packs[id].createSendPack());
				packs[id].render(stage);
			}

		}

	})();

packSrv.init();

