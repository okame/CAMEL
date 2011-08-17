var controller = {};

(function($) {
		controller.con = {};
		controller.operations = {};
		//var player = player;
		controller.init = function(init) {
			var that = this;

			this.con = new window.WebSocket('ws://localhost:8000');

			/*------------------------------------------------
			 * Client operation implementations
			 ------------------------------------------------*/
			this.con.onclose = function(e) {
				console.log('connection closed');
			};
			this.con.onopen = function(e) {
				console.log('connecting');
				controller.con.send(util.createMsg('clientInit',''));
				if(init) return init();
			};
			this.con.onmessage = function(msg) {
				var that = controller;
				var res ={};
				var buf = JSON.parse(msg.data);
				var ope = buf.ope || '';
				var arg = buf.arg || '';
				if(ope == 'render') {
					display.matrix.stage = arg;
					display.render();
				} else {
					if(player.operations[ope]) res = player.operations[ope](arg);
					if(res) that.con.send(res);
				}
			};
		}
		controller.cmd = function(msg) {
			this.con.send(msg);
		}
		controller.evs = function() {
			this.cmd(util.createMsg('evs',''));
		}
		controller.eve = function() {
			this.cmd(util.createMsg('eve',''));
		}

	})($);
