var player = {};
var env = {};

(function($) {
		var that = player;
		that.stage = {};
		that.operations = {
			start : function(arg) {
				console.log('[ start ]');
			},
			ready : function(arg) {
				console.log('[ ready ]');
				that.stage = arg;
				env = arg;
				display.init(env.stage);
				display.render();
				return (util.createMsg('readyOk',''));
			},
			next : function(arg) {
				console.log('[ next ]');
				var msg = userScript.next(arg);
				return (util.createMsg('move', msg));
			}
		};
	})();

