/**
 * display.js
 *	called "display.init" when client get ready message from server with stage ENV.
 *	called "display.render" method at "evLoop" on game.js per frame rate.
 *
 * dep:
 * 	Pack.js
 *
 */

display = {};

(function($) {

		/* now pack position */
		display.packs = [];

		/* grid data matrix */
		display.matrix = {
			stage : []
		}

		/* Gif timer for pack mouth animation*/
		display.gifTimer;

		display.lotate = [
			  CONSTANT.MOUTH.MATER
			, CONSTANT.MOUTH.SMALL
			, CONSTANT.MOUTH.LARGE
			, CONSTANT.MOUTH.SMALL
		];

		display.clearGifTimer = function() {
			clearInterval(this.gifTimer);
		}

		display.gifStart = function(dir) {
			display.gifTimer = setInterval(function() {
					display.mouthNo = (display.mouthNo >= (display.lotate.length - 1)? 0 : (display.mouthNo + 1));
				}, OPTIONS.gifTimer);
			};

		display.imgs = [];

		display.renderQueue = {};


		/** 
		 * Main.
		 */
		display.render = function () {
			this.renderAllObjects();
		}

		// Initialize
		display.init = function (arg) {
			var i,j,
			matrixSizeX = OPTIONS.canvasWidth / OPTIONS.cellSize,
			matrixSizeY = OPTIONS.canvasHeight / OPTIONS.cellSize;
			this.matrixSizeX = matrixSizeX;
			this.matrixSizeY = matrixSizeY;

			// matrixs
			for (var mn in this.matrix) {
				this.matrix[mn] = new Array(this.matrix.length);
				for (i = 0; i < this.matrixSizeX; i++) {
					this.matrix[mn][i] = new Array(matrixSizeY);
					for (j = 0; j < this.matrixSizeY; j++) {
						this.matrix[mn][i][j] = false;
					}
				}
			}

			this.matrix.stage = env.stage;

			// canvas
			this.canvas = document.getElementById('canvasMain');
			this.ctx = this.canvas.getContext('2d');
			renderUtil.init(this.ctx);

			for(i=0; i<env.PACK_NUM; i++) {
				this.packs[i] = new Pack(env.DEFAULT_PACK_X, env.DEFAULT_PACK_Y, 'left', i, this.ctx);
			}


		}

		/**
		 * render dotted line as grid on stage.
		 */
		display.renderGridLine = function () {
			var i,
			x1, y1, x2, y2;
			width = OPTIONS.canvasWidth,
			height = OPTIONS.canvasHeight,
			color = OPTIONS.gridColor,
			cellSize = OPTIONS.cellSize,
			cellNumX = width / cellSize,
			cellNumY = height / cellSize,
			ctx = this.ctx;

			// draw vertical line
			y1 = 0;
			y2 = height;
			for (i = 0; i < cellNumX - 1; i++) {
				x1 = (i + 1) * cellSize;
				x2 = (i + 1) * cellSize;
				renderUtil.stroke(x1, y1, x2, y2, color);
			}

			// draw horizontal line
			x1 = 0;
			x2 = width;
			for (i = 0; i < cellNumY - 1; i++) {
				y1 = (i + 1) * cellSize;
				y2 = (i + 1) * cellSize;
				renderUtil.stroke(x1,y1,x2,y2,color);
			}
		}

		/**
		 * render cell at {i, j} with render method f.
		 * @param i coordinate of a cell
		 * @param j coordinate of a cell
		 * @param f render method
		 */
		display.renderCell = function (i, j, f, arg){
			var size = OPTIONS.cellSize,
			x, y;
			x = i * size;
			y = j * size;
			f.apply(this, [x, y, arg]);
		}

		/**
		 * render feed at {x, y}:pixel.
		 * @param x
		 * @param y
		 * @param point
		 */
		display.renderFeed = function (x, y, point) {
			var size = OPTIONS.cellSize
			,r = (size-1)/8
			,rx = x + size/2
			,ry = y + size/2
			,color;
			if(point == 1) {
				color = OPTIONS.feedColorS;
			} else if(point == 2) {
				color = OPTIONS.feedColorM;
			} else if(point == 3) {
				color = OPTIONS.feedColorL;
			}
			renderUtil.circle(rx, ry, r, color);
		}

		/**
		 * render stage block.
		 * @param x
		 * @param y
		 */
		display.renderStage = function (x, y, dir) {
			renderUtil.line(x, y, OPTIONS.frameColor, dir);
		}

		display.getBlockCode = function(x, y) {
			var r, l, u, d
			, stage = this.matrix.stage
			, code;

			if(stage[x + 1]) {
				d = stage[x + 1][y][env.STAGE_OBJECTS.BLOCK]
			}
			if(stage[x - 1]) {
				u = stage[x - 1][y][env.STAGE_OBJECTS.BLOCK]
			}
			if(stage[x][y - 1]) {
				l = stage[x][y - 1][env.STAGE_OBJECTS.BLOCK]
			}
			if(stage[x][y + 1]) {
				r = stage[x][y + 1][env.STAGE_OBJECTS.BLOCK]
			}

			if(r && l) {
				code = CONSTANT.BLOCK.H;
			} else if(u && d) {
				code = CONSTANT.BLOCK.V;
			} else if(r && d) {
				code = CONSTANT.BLOCK.RD;
			} else if(r && u) {
				code = CONSTANT.BLOCK.RU;
			} else if(l && u) {
				code = CONSTANT.BLOCK.LU;
			} else if(l && d) {
				code = CONSTANT.BLOCK.LD;
			} else {
				code = CONSTANT.BLOCK.H;
			}

			return  code;
		}

		/**
		 * Set render objects into queue.
		 */
		display.renderAllObjects = function(stage) {
			var stage = stage || this.matrix.stage
			, i, j, k
			, point
			, dir;

			display.renderQueue.block = [];
			display.renderQueue.pack = [];
			display.renderQueue.feed = [];
			for(i = 0; i < stage.length; i++) {
				for(j = 0; j < stage[i].length; j++) {
					if(stage[j][i][env.STAGE_OBJECTS.BLOCK] == env.BLOCK_EXIST) {
						dir = this.getBlockCode(j, i);
						this.renderCell(i, j, this.renderStage, dir);
					} else if(stage[j][i][env.STAGE_OBJECTS.PACK] > 0) {
						// render all packs
						for(k=0; k<env.PACK_NUM; k++) {
							if(stage[j][i][env.STAGE_OBJECTS.PACK] & Math.pow(2, k)) {
								di = i - this.packs[k].i; 
								dj = j - this.packs[k].j; 
								this.packs[k].movePack(di, dj, k);
								this.packs[k].i = i;
								this.packs[k].j = j;
							}
						}
					} else if(stage[j][i][env.STAGE_OBJECTS.FEED] > 0) {
						point = stage[j][i][env.STAGE_OBJECTS.FEED];
						this.renderCell(i, j, this.renderFeed, point);
					} else {
						this.renderCell(i, j, renderUtil.clearRect);
					}
				}
			}
		}

		display.stop = function () {
			this.clearGifTimer();
		}
	})($);


