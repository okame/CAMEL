var player = {};
var env = {};

(function($) {
		var that = player;
		that.stage = {};
		that.operations = {
			// synack
			synack : function(arg) {
				console.log('[ synack ]');
			},
			start : function(arg) {
				console.log('[ start ]');
			},
			prestart : function(arg) {
				console.log('[ prestart ]');
				that.stage = arg;
				env = arg;
				display.init(env.stage);
				display.render();
				return (util.createMsg('ack',''));
			},
			next : function(arg) {
				console.log('[ next ]');
				var msg = {};
				var dis = {};
				var buf = Math.floor(Math.random()*10);
				if(buf % 4 == 0 ) {
					dis['i'] = 1;
					dis['j'] = 0;
				} else if(buf % 4 == 1 ) {
					dis['i'] = 0;
					dis['j'] = 1;
				} else if(buf % 4 == 2 ) {
					dis['i'] = -1;
					dis['j'] = 0;
				} else if(buf % 4 == 3 ) {
					dis['i'] = 0;
					dis['j'] = -1;
				} else {
					dis['i'] = 0;
					dis['j'] = 1;
				}
				msg.i = arg.x + dis.i;
				msg.j = arg.y + dis.j;
				return (util.createMsg('move', msg));
			}
		};
	})();

