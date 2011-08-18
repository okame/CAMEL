var userScript = {};

(function($) {

		var dis = {i:1, j:0};

		userScript.init = function() {
		}

		userScript.random = function(pack) {
			if(pack.isWall) console.log(pack.isWall);
			var msg = {};
			var dir = 0;
			var buf = Math.floor(Math.random()*4);
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
			msg.i = pack.x + dis.i;
			msg.j = pack.y + dis.j;

			return msg;
		}

		userScript.changeDirAtWall = function(pack) {
			if(pack.isWall) console.log(pack.isWall);
			var msg = {};

			if (pack.isWall) {
				dir = Math.floor(Math.random()*4);
				if(dir % 4 == 0 ) {
					dis['i'] = 1;
					dis['j'] = 0;
				} else if(dir % 4 == 1 ) {
					dis['i'] = 0;
					dis['j'] = 1;
				} else if(dir % 4 == 2 ) {
					dis['i'] = -1;
					dis['j'] = 0;
				} else if(dir % 4 == 3 ) {
					dis['i'] = 0;
					dis['j'] = -1;
				} else {
					dis['i'] = 0;
					dis['j'] = 1;
				}
			}


			msg.i = pack.x + dis.i;
			msg.j = pack.y + dis.j;

			return msg;

		}

		// userScript.next = userScript.random;
		userScript.next = userScript.changeDirAtWall;

	})();
