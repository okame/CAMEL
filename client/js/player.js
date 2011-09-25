var player = {};
var env = {};

(function($) {
		var that = player;
		that.stage = {};
		that.operations = {
			 start : function(arg) {
				console.log('[ start ]');
			}
			,ready : function(arg) {
				console.log('[ ready ]');
				var msg = {};
				msg.id = that.id;
				that.stage = arg;
				env = arg;
				display.init(env.stage);
				display.render();
				userScript.init();
				return (util.createMsg('readyOk', msg));
			}
			,next : function(arg) {
				console.log('[ next ]');
				var msg = userScript.next(arg);
				msg.id = that.id;
				return (util.createMsg('move', msg));
			}
			,scr : function(arg) {
				$('div#usrInfo div#score').html(arg || '0');
			}
			,init : function(arg) {
				that.id = arg.id;
				$('div#usrInfo div#id').html(arg.id);
				$('div#usrInfo div#score').html(arg.score);
				console.log('id:'+that.id);
			}
			,end : function(arg) {
				var winText = '<b>Winner : '+arg.winner.id+'</b><br />'
					+ 'point : ' + arg.winner.point;
				$('div#usrInfo div#g_status').html('');
				$('div#usrInfo div#winner').html(winText);
			}
		};
	})($);

