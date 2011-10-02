/**
 * display.js
 *
 * dep:
 * 	Pack.js
 *
 * comment:
 *
 * called "display.init" when client get ready message from server with stage ENV.
 * called "display.render" method at "evLoop" on game.js per frame rate.
 * 
 *
 */

display = {};

(function($) {

		// now pack position
		display.packs = {};

		// grid data matrix
		display.matrix = {
			stage : [],
			pack: [],
			enemy : []
		}

		// main
		display.render = function () {
			//this.ctx.clearRect(0,0,OPTIONS.canvasWidth,OPTIONS.canvasHeight);
			this.renderGridLine();
			this.renderAllObjects();
		}

		// initialize
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

			for(i=0; i<env.PACK_NUM; i++) {
				this.packs[i] = new Pack(env.DEFAULT_PACK_X, env.DEFAULT_PACK_Y, 'left', this.ctx);
			}

		}

		/**
		 * render dotted line as grid on stage.
		 */
		display.renderGridLine= function () {
			var i,
			x1, y1, x2, y2;
			width = OPTIONS.canvasWidth,
			height = OPTIONS.canvasHeight,
			color = OPTIONS.gridColor,
			cellSize = OPTIONS.cellSize,
			cellNumX = width / cellSize,
			cellNumY = height / cellSize,
			ctx = this.canvas.getContext('2d');

			// draw vertical line
			y1 = 0;
			y2 = height;
			for (i = 0; i < cellNumX - 1; i++) {
				x1 = (i + 1) * cellSize;
				x2 = (i + 1) * cellSize;
				this.stroke(x1,y1,x2,y2,color);
			}

			// draw horizontal line
			x1 = 0;
			x2 = width;
			for (i = 0; i < cellNumY - 1; i++) {
				y1 = (i + 1) * cellSize;
				y2 = (i + 1) * cellSize;
				this.stroke(x1,y1,x2,y2,color);
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
		 */
		display.renderFeed = function (x, y) {
			var size = OPTIONS.cellSize
			,r = (size-1)/3
			,rx = x + size/2
			,ry = y + size/2
			,msize = Math.PI/6,mths,mthe;

			//render circle
			this.ctx.fillStyle = OPTIONS.feedColor;
			this.ctx.beginPath();
			this.ctx.arc(rx, ry, r, 0, Math.PI * 2, true);
			this.ctx.fill();
			this.ctx.closePath();

		}

		display.renderStage = function (x, y) {
			var size = OPTIONS.cellSize;
			this.ctx.fillStyle = OPTIONS.stageColor;
			this.ctx.fillRect(x,y,size,size);
			this.ctx.fillStyle = "";
		}

		/**
		 * render all objects.
		 * - packs
		 * - feeds
		 * - stage blocks
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
					} else if(stage[i][j][env.STAGE_OBJECTS.PACK] > 0) {
						// render all packs
						for(k=0; k<env.PACK_NUM; k++) {
							if(stage[i][j][env.STAGE_OBJECTS.PACK] & Math.pow(2, k)) {
								di = i - this.packs[k].i; 
								dj = j - this.packs[k].j; 
								this.packs[k].movePack(di, dj, k);
								this.packs[k].i = i;
								this.packs[k].j = j;
							}
						}
					} else if(stage[i][j][env.STAGE_OBJECTS.FEED] > 0) {
						this.renderCell(i, j, this.renderFeed);
					}
				}
			}
		}

		// stroke line from (x1, y1) to (x2, y2)
		// default line color : black
		display.stroke = function(x1, y1, x2, y2, color) {
			var ctx = this.ctx,
			color = color || "black";
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.closePath();
			ctx.stroke();

			this.ctx.strokeStyle = "";
		}

		/*------------------------------------------------
		 * Called when a client get a message from server.
		 ------------------------------------------------*/
				display.onMessage = function(point) {
					display.movePack(point.i, point.j);
				}

				/*------------------------------------------------
				 * Called when connection is open.
				 ------------------------------------------------*/
				display.onOpen = function() {
					console.log('display open.')
					display.init();
					if (!util.checkBrowser()) {
						return false;
					}
					display.draw();
				}

			})($);


