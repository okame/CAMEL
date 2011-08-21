var userScript = {};

(function($) {

		var dis = {i:1, j:0};
		var i, j;
		var items = [];

		/**
		 * Create items as array from cells.
		 *
		 */
		var createItemHash = function(cells) {
			var item = {};
			var point;
			var msg = {};
			items = [];
			for(i = 0; i < cells.length; i++) {
				for(j = 0; j < cells[i].length; j++) {
					point = cells[i][j][env.STAGE_OBJECTS.FEED];
					if(point > 0) {
						items.push({i:i, j:j, p:point});
					}
				}
			}
		}

		/**
		 * Return a random next cell.
		 */
		var randomCell = function(pack) {
			var dis = {};
			var msg = {};
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

		userScript.init = function() {
		}

		/**
		 * Takagi's Algorithm
		 */
		userScript.takagi = function(arg) {
			var i;
			var pack = arg.pack;
			var dis, dis_min = env.STAGE_WIDTH;
			var candidate_item;
			var msg = {};
			createItemHash(arg.cells);

			// Search nearest item as "candidate_item".
			for(i = 0; i < items.length; i++) {
				dis = Math.abs(pack.x - items[i].i) + Math.abs(pack.y - items[i].j); 
				if(dis < dis_min) {
					candidate_item = items[i];
					dis_min = dis;
				}
			}

			if(candidate_item) {
				console.log('Forward to item.');
				if((candidate_item.i - pack.x) != 0) {
					msg.i = pack.x + ((candidate_item.i > pack.x)? 1 : -1);
					msg.j = pack.y;
				} else {
					msg.i = pack.x;
					msg.j = pack.y + ((candidate_item.j > pack.y)? 1 : -1);
				}
			} else {
				console.log('random walk.');
				msg = randomCell(pack);
			}

			console.log(msg.i, msg.j);
			return msg;
		}

		/**
		 * Random Walk.
		 */
		userScript.random = function(arg) {
			var pack = arg.pack;

			if(pack.isWall) console.log(pack.isWall);

			return randomCell(pack);
		}

		/**
		 * Change direction when next cell is wall.
		 */
		userScript.changeDirAtWall = function(arg) {
			var pack = arg.pack;
			var msg = {};

			createItemHash(arg.cells);

			if(pack.isWall) console.log(pack.isWall);
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
		// userScript.next = userScript.changeDirAtWall;
		userScript.next = userScript.takagi;

	})();
