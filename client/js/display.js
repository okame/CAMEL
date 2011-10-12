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
			  CONSTATNT.MOUTH.MATER
			, CONSTATNT.MOUTH.SMALL
			, CONSTATNT.MOUTH.LARGE
			, CONSTATNT.MOUTH.SMALL
		];

		display.gifStart = function(dir) {
			display.gifTimer = setInterval(function() {
					display.mouthNo = (display.mouthNo >= (display.lotate.length - 1)? 0 : (display.mouthNo + 1));
				}, OPTIONS.gifTimer);
			};

		display.imgs = [];

		display.renderQueue = {};
		display.renderQueue.block = [];
		display.renderQueue.pack = [];
		display.renderQueue.feed = [];


		/** 
		 * Main.
		 */
		display.render = function () {
			this.ctx.clearRect(0,0,OPTIONS.canvasWidth,OPTIONS.canvasHeight);
			//this.renderGridLine();
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
				this.packs[i] = new Pack(env.DEFAULT_PACK_X, env.DEFAULT_PACK_Y, 'left', this.ctx);
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
		display.renderCell = function (i, j, f){
			var size = OPTIONS.cellSize,
			x, y;
			x = i * size;
			y = j * size;
			f.apply(this, [x, y]);
		}

		/**
		 * render feed at {x, y}:pixel.
		 * @param x
		 * @param y
		 */
		display.renderFeed = function (x, y) {
			var size = OPTIONS.cellSize
			,r = (size-1)/3
			,rx = x + size/2
			,ry = y + size/2
			,msize = Math.PI/6,mths,mthe;
			renderUtil.circle(rx, ry, r, OPTIONS.feedColor);

		}

		/**
		 * render stage block.
		 * @param x
		 * @param y
		 */
		display.renderStage = function (x, y) {
			renderUtil.rect(x, y, OPTIONS.stageColor);
		}

		/**
		 * render all objects.
		 * - packs
		 * - feeds
		 * - stage blocks
		 * @param stage
		 */
		display.renderAllObjects= function(stage) {
			var enemie = this.matrix.enemy,
			stage = stage || this.matrix.stage,
			size = OPTIONS.cellSize,
			cellNumX = this.matrixSizeX,
			cellNumY = this.matrixSizeY,
			i, j, k, x, y, di, dj;

			for(i = 0; i < stage.length; i++) {
				for(j = 0; j < stage[i].length; j++) {
					if(stage[i][j][env.STAGE_OBJECTS.BLOCK] == env.EXIST_FLG) {
						this.renderCell(i, j, this.renderStage);
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
						this.renderCell(i, j, this.renderFeed);
					}
				}
			}
		}

		/**
		 * Set render objects into queue.
		 */
		display.setRenderQueue = function(stage) {
			var stage = stage || this.matrix.stage
			, i, j, k;

			for(i = 0; i < stage.length; i++) {
				for(j = 0; j < stage[i].length; j++) {
					if(stage[i][j][env.STAGE_OBJECTS.BLOCK] == env.EXIST_FLG) {
						// this.renderCell(i, j, this.renderStage);
						this.renderQueue.block.push({i:i, j:j});
					} else if(stage[j][i][env.STAGE_OBJECTS.PACK] > 0) {
						// render all packs
						for(k=0; k<env.PACK_NUM; k++) {
							if(stage[j][i][env.STAGE_OBJECTS.PACK] & Math.pow(2, k)) {
								di = i - this.packs[k].i; 
								dj = j - this.packs[k].j; 
								this.packs[k].movePack(di, dj, k);
								this.packs[k].i = i;
								this.packs[k].j = j;

								this.renderQueue.pack.push({di:di, dj:dj, id:k});
							}
						}
					} else if(stage[j][i][env.STAGE_OBJECTS.FEED] > 0) {
						//this.renderCell(i, j, this.renderFeed);
						this.renderQueue.feed.push({i:i, j:j});
					}
				}
			}

		}

	})($);


