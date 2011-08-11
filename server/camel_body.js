var packSrv = {};
var sys;

(function() {

		packSrv.con = {};
		packSrv.sys = require('sys');
		sys = packSrv.sys;
		packSrv.http = require('http');
		packSrv.ws = require('websocket-server');
		packSrv.json = require('./json2');
		packSrv.pack = require('./pack');
		var env = require('./env').env;
		packSrv.sv = packSrv.ws.createServer();
		packSrv.timer;
		packSrv.sv.listen(8000);
		packSrv.rate = 200;
		packSrv.packs = {};

		// DEBUG

		packSrv.init= function() {
			// param
			that = this;

			// ope
			this.operations = {
				echo : function() {
					that.sys.log('call echo');
				},

				// event start
				evs : function(con) {
					that.timer = setInterval(packSrv.evLoop, that.rate);
				},

				// event stop
				eve : function() {
					clearInterval(that.timer);
				},

				// synchronize
				syn : function(con) {
					that.sys.log('called syn');
					con.send(that.createMsg('synack', env));
				},

				// acknowledge
				ack : function(con) {
					var p = new that.pack.Pack(con, env.DEFAULT_PACK_X, env.DEFAULT_PACK_Y);
					that.sys.log('called ack');
					that.packs[con.id] = p;
					that.sys.log('push pack[id='+p.getId()+']');
					//that.timer = setInterval(packSrv.evLoop, that.rate);
				},

				// move pack
				move : function(con, msg) {
					var packs = that.packs;
					var x, y, sid;
					x = packs[con.id].getX();
					y = packs[con.id].getY();
					sid = env.STAGE_OBJECTS.STAGE_PACK;
					env.stage[x][y][sid] = env.EMPTY_FLG;
					packs[con.id].move(msg);
					x = packs[con.id].getX();
					y = packs[con.id].getY();
					if(env.stage[x] && env.stage[x][y]) { 
						env.stage[x][y][sid] += Math.pow(2, packs[con.id].id);
						that.sys.log(Math.pow(2, packs[con.id].id)+':'+x+','+y);
					}
					
					//packSrv.sys.log(x+','+y);
				}

			}

			//add listener
			this.sv.addListener('connection', function(con) {
					var i = 0, j = 0, that = packSrv;
					that.sys.log(con.id);

					con.addListener('message', function(msg){
							var req = that.parseRequest(msg);
							if(req && that.operations[req.ope]) {
								that.operations[req.ope](con, req.data);
							} else {
								that.sys.log('Recieve invalid massge');
								con.send('Invalid massge');
							}
						});
				});

			this.sys.puts('Server running');
		};

		packSrv.evLoop = function() {
			var i = 0, j = 0, d;
			var con = packSrv.con;
			var packs = packSrv.packs;
			var stage = env.stage;

			for(var id in packs) {
				//packSrv.sys.log(packs[id].getX()+','+packs[id].getY());
				packs[id].next();
				packs[id].render(env.stage);
			}
		}

		packSrv.parseRequest = function(msg) {
			var msgb = JSON.parse(msg);
			req = {};
			req.ope  = msgb.ope;
			req.data = msgb.arg || '';
			return req;
		};

		packSrv.createMsg = function(ope, arg) {
			var msg = {
				ope:ope,
				arg:arg
			};
			return JSON.stringify(msg);
		}

	})();
packSrv.init();

