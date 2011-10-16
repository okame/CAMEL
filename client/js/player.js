/**
 * player.js
 *
 * dep :
 * 	userScript.js
 * 	display.js
 */
var player = {};
var env = {};

(function($) {
		var that = player;
		that.stage = {}
		teamName = OPTIONS.teamName;

		that.operations = {
			 start : function(arg) {
				console.log('[ start ]');
			}
			,ready : function(arg) {
				console.log('[ ready ]');
				var msg = {}
				, packImg;
				msg.id = that.id;
				that.stage = arg;
				env = arg;
				packImg = '<img src="./img/right_s_'+CONSTANT.COLOR[OPTIONS.packColor[that.id]]+'.png" /><br />';
				$('div#usrInfo div#team').prepend(packImg);
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
			,state : function(arg){
				$('div#usrInfo div#g_status').html(arg);
			}
			,init : function(arg) {
				var usrInfo = arg.usrInfo
				, state = usrInfo.state
				, id = usrInfo.id
				, score = usrInfo.score;
				env = arg.env;
				display.init(env.stage);
				display.render();
				that.id = usrInfo.id;
				$('div#usrInfo div#id').html(id);
				$('div#usrInfo div#g_status').html(state);
				$('div#usrInfo div#score').html(score);
				$('div#usrInfo div#g_status').html(state);
				$('div#usrInfo div#team').html(teamName);
				console.log('id:'+that.id);
			}
			,state : function(arg) {
				$('div#usrInfo div#g_status').html(arg);
			}
			,end : function(arg) {
				var winText = '<b>Winner : '+arg.winner.id+'</b><br />'
					+ 'point : ' + arg.winner.point;
				$('div#usrInfo div#g_status').html('END');
				$('div#usrInfo div#winner').html(winText);
				display.clearGifTimer();
			}
		};

	})($);

