var userScript = {};

(function($) {

		var save = [];

		var R = 1
		, D = 2
		, L = 3
		, U = 4
		, BLOCK
		, FEED
		, EXIST;

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



		var randomDir = function() {
			var buf = Math.floor(Math.random()*4);
			if(buf % 4 == 0 ) {
				return R;
			} else if(buf % 4 == 1 ) {
				return L;
			} else if(buf % 4 == 2 ) {
				return U;
			} else if(buf % 4 == 3 ) {
				return D;
			}
		}

		var getRandomVal = function(values) {
			var buf = Math.floor(Math.random()*values.length);
			return values[buf % values.length];
		}

		var checkBlock = function(cells, pack, dir) {
			var x = pack.x
			, y = pack.y;
			if(dir == R) {
				if(cells[x+1][y][BLOCK] == EXIST) return true;
			} else if(dir == L) {
				if(cells[x-1][y][BLOCK] == EXIST) return true;
			} else if(dir == U) {
				if(cells[x][y-1][BLOCK] == EXIST) return true;
			} else if(dir == D) {
				if(cells[x][y+1][BLOCK] == EXIST) return true;
			}
			return false;
		}

		var getBranch = function(cells, pack, dir) {
			var x = pack.x
			, y = pack.y
			, branch = [];

			if(dir != L && !checkBlock(cells, pack, R)) branch.push(R);
			if(dir != R && !checkBlock(cells, pack, L)) branch.push(L);
			if(dir != D && !checkBlock(cells, pack, U)) branch.push(U);
			if(dir != U && !checkBlock(cells, pack, D)) branch.push(D);

			return branch;
		}

		var getNext = function(cells, pack, dir) {
			var next = {}
			, x = pack.x
			, y = pack.y;
			if(dir == R) {
				next.i = x + 1;
				next.j = y;
			} else if(dir == L) {
				next.i = x - 1;
				next.j = y;
			} else if(dir == U) {
				next.i = x;
				next.j = y - 1;
			} else if(dir == D) {
				next.i = x;
				next.j = y + 1;
			}
			return next
		}

		userScript.init = function() {
			BLOCK = env.STAGE_OBJECTS.BLOCK;
			FEED = env.STAGE_OBJECTS.FEED;
			EXIST = env.BLOCK_EXIST_YES;
		}

		/**
		 * Takagi's Algorithm
		 */
			userScript.takagi1 = function(arg) {
				var i
				, pack = arg.pack
				, dis
				, dis_min = env.STAGE_WIDTH
				, candidate_item
				, msg = {};
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

			var dir = R;
			userScript.random2 = function(arg) {
				var cells = arg.cells
				, pack = arg.pack
				, branch
				, turn = arg.turn
				, next;

				// 分岐できる方向を調査
				branch = getBranch(cells, pack, dir);
				if(branch.length) {
					// ランダムに方向を変える
					dir = getRandomVal(branch);
				}

				// 現在の進行方向で次に進むマスを取得
				next = getNext(cells, pack, dir);

				save.push({i:(next.i - pack.x), j:(next.j - pack.y)});

				return next;
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

			userScript.init_flag = false;
			userScript.my_cells = [];
			userScript.kondo1 = function(arg) {
				var i;
				var pack = arg.pack;
				var cells = arg.cells;
				var stage_size = env.STAGE_WIDTH;
				var msg = {};
				var dis = {};

				if(!this.init_flag){
					// initialize my_stage
					for(i = 0; i < env.STAGE_XSIZE; i++){
						this.my_cells[i] = [];
						for(j = 0; j < env.STAGE_YSIZE; j++){
							this.my_cells[i][j] = 0;
						}
					}
					console.log('finish to initial my_stage.');
					this.init_flag=true;
				}

				/*
				 * check wall.
				 */
			var right_flag = false;
			var down_flag = false;
			var left_flag = false;
			var up_flag = false;

			if(cells[pack.x+1][pack.y][env.STAGE_OBJECTS.BLOCK] == env.BLOCK_EXIST_NO ){
				right_flag = true;
			}
			if(cells[pack.x][pack.y+1][env.STAGE_OBJECTS.BLOCK] == env.BLOCK_EXIST_NO ){
				down_flag = true;
			}
			if(cells[pack.x-1][pack.y][env.STAGE_OBJECTS.BLOCK] == env.BLOCK_EXIST_NO ){
				left_flag = true;
			}
			if(cells[pack.x][pack.y-1][env.STAGE_OBJECTS.BLOCK] == env.BLOCK_EXIST_NO ){
				up_flag = true;
			}

			/*
			 * check my route.
			 */
			var min_route=0;
			var min_route_value = 9999;

			if(right_flag){
				if( min_route_value > this.my_cells[pack.x][pack.y+1] ){
					min_route=1;
					min_route_value = this.my_cells[pack.x+1][pack.y];
				}
			}
			if(down_flag){
				if( min_route_value > this.my_cells[pack.x][pack.y+1] ){
					min_route=2;
					min_route_value = this.my_cells[pack.x][pack.y+1];
				}
			}
			if(left_flag){
				if( min_route_value > this.my_cells[pack.x-1][pack.y] ){
					min_route=3;
					min_route_value = this.my_cells[pack.x-1][pack.y];
				}
			}
			if(up_flag){
				if( min_route_value > this.my_cells[pack.x][pack.y-1] ){
					min_route=4;
					min_route_value = this.my_cells[pack.x][pack.y-1];
				}
			}

			/*
			 * decide next cell
			 */
			if(min_route==1){
				dis['i'] = 1;
				dis['j'] = 0;
				this.my_cells[pack.x+1][pack.y]++;
			}else if(min_route==2){
				dis['i'] = 0;
				dis['j'] = 1;
				this.my_cells[pack.x][pack.y+1]++;
			}else if(min_route==3){	
				dis['i'] = -1;
				dis['j'] = 0;		
				this.my_cells[pack.x-1][pack.y]++; 
			}else if(min_route==4){
				dis['i'] = 0;
				dis['j'] = -1;
				this.my_cells[pack.x][pack.y-1]++;
			}

			msg.i = pack.x + dis.i;
			msg.j = pack.y + dis.j;

			return msg;

		}


		//userScript.next = userScript.random;
		//userScript.next = userScript.random2;
		// userScript.next = userScript.changeDirAtWall;
		// userScript.next = userScript.takagi;
		// userScript.next = userScript.takagi2;
		 userScript.next = userScript.kondo1;

	})();
