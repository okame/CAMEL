display = {};

(function($) {

		// options
		display.options= {
			packColor : "yellow",
			feedColor : "red",
			enemyColor : "red",
			stageColor : "gray",
			canvasWidth : 600,
			canvasHeight : 600,
			cellSize : 30,
			frameRate : 90,//ms
			gridColor : 'rgb(240, 240, 240)',
			bgColor : 'rgb(255, 255, 255)'
		}

		// now pack position
		display.packPos = {};

		// passes
		display.passes = {}

		// grid data matrix
		display.matrix = {
			stage : [],
			pack: [],
			enemy : []
		}
		display.matrirxNum = 0;

		display.dumpPos = function(msg) {
			for(i=0; i<env.PACK_NUM; i++) {
				console.log(msg+' packPos['+i+']:', this.packPos[i].i, this.packPos[i].j, this.packPos[i].dir);
				break;
			}
		}

		// main
		display.render = function () {
			//this.ctx.clearRect(0,0,this.options.canvasWidth,this.options.canvasHeight);
			this.renderGridLine();
			this.renderAllObjects();
		}

		// initialize
		display.init = function (arg) {
			var i,j,
			matrixSizeX = this.options.canvasWidth / this.options.cellSize,
			matrixSizeY = this.options.canvasHeight / this.options.cellSize;
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
			for(i=0; i<env.PACK_NUM; i++) {
				this.packPos[i] = {};
				this.packPos[i].i = env.DEFAULT_PACK_X;
				this.packPos[i].j = env.DEFAULT_PACK_Y;
				this.packPos[i].dir = 'left';
			}

			// canvas
			this.canvas = document.getElementById('canvasMain');
			this.ctx = this.canvas.getContext('2d');
		}

		// whether a browser suport html5 canvas tag
		display.checkBrowser = function () {
			if ( ! this.canvas || ! this.canvas.getContext ) {
				console.log("This browser unsupported HTML5.");
				return false;
			} else {
				return true;
			}
		}

		// render dotted line as grid
		display.renderGridLine= function () {
			var i,
			x1, y1, x2, y2;
			width = this.options.canvasWidth,
			height = this.options.canvasHeight,
			color = this.options.gridColor,
			cellSize = this.options.cellSize,
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

		// render a cell
		// @param x,y : origin coordinate of a cell
		display.renderCell = function (i, j, f){
			var size = this.options.cellSize,
			x, y;
			x = i * size;
			y = j * size;
			f.apply(this, [x, y]);
		}

		display.renderFeed = function (x, y, dir) {
			var size = this.options.cellSize
			,r = (size-1)/3
			,rx = x + size/2
			,ry = y + size/2
			,msize = Math.PI/6,mths,mthe;

			//render circle
			this.ctx.fillStyle = this.options.feedColor;
			this.ctx.beginPath();
			this.ctx.arc(rx, ry, r, 0, Math.PI * 2, true);
			this.ctx.fill();
			this.ctx.closePath();

		}

		display.renderPack = function (x, y, dir) {
			var size = this.options.cellSize
			,r = (size-1)/2
			,rx = x + size/2
			,ry = y + size/2
			,msize = Math.PI/6,mths,mthe;

			//render circle
			this.ctx.fillStyle = this.options.packColor;
			this.ctx.beginPath();
			this.ctx.arc(rx, ry, r, 0, Math.PI * 2, true);
			this.ctx.fill();
			this.ctx.closePath();

			if(dir == 'left') {
				mths = Math.PI + msize;
				mthe = Math.PI - msize;
			} else if(dir == 'down') {
				mths = Math.PI / 2 + msize;
				mthe = Math.PI / 2 - msize;
			} else if(dir == 'right') {
				mths = msize;
				mthe = 2 * Math.PI - msize;
			} else if(dir == 'up') {
				mths = Math.PI * 3 / 2 + msize;
				mthe = Math.PI * 3 / 2 - msize;
			} else {
				return false;
			}

			//erase mouth region
			this.ctx.fillStyle = this.options.bgColor;
			this.ctx.beginPath();
			this.ctx.arc(rx, ry, r, mths, mthe, true);
			this.ctx.fill();
			this.ctx.closePath();
			this.ctx.beginPath();
			this.ctx.moveTo(rx, ry);
			this.ctx.lineTo(rx + r * Math.cos(mths), ry + r * Math.sin(mths));
			this.ctx.lineTo(rx + r * Math.cos(mthe), ry + r * Math.sin(mthe));
			this.ctx.closePath();
			this.ctx.fill();

			this.ctx.fillStyle = "";
		}

		display.clearPack = function (x, y) {
			var size = this.options.cellSize;
			this.ctx.fillStyle = this.options.bgColor;
			this.ctx.clearRect(x,y,size,size);
			this.ctx.fillStyle = "";
		}

		display.renderEnemy = function (x, y) {
			var size = this.options.cellSize;
			this.ctx.fillStyle = this.options.enemyColor;
			this.ctx.fillRect(x,y,size,size);
			this.ctx.fillStyle = "";
		}

		display.renderStage = function (x, y) {
			var size = this.options.cellSize;
			this.ctx.fillStyle = this.options.stageColor;
			this.ctx.fillRect(x,y,size,size);
			this.ctx.fillStyle = "";
		}

		// render all Packs
		display.renderAllObjects= function(stage) {
			var enemie = this.matrix.enemy,
			stage = stage || this.matrix.stage,
			size = this.options.cellSize,
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
								di = i - this.packPos[k].i; 
								dj = j - this.packPos[k].j; 
								this.movePack(di, dj, k);
								this.packPos[k].i = i;
								this.packPos[k].j = j;
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

		display.movePack = function(di, dj, id) {
			var p = this.packPos[id], x, y,
			pNext = {};
			pNext.i = p.i + di;
			pNext.j = p.j + dj;

			p.dir = this.getPackPos(di, dj, id);

			//check frame, stage and motion lock
			if(  pNext.i < 0 //|| pNext.i >= this.matrixSizeX
				|| pNext.j < 0 //|| pNext.j >= this.matrixSizeY
				|| this.motionLock) {
				return false;
			} else if(di == 0 && dj == 0) {
				x = p.i * this.options.cellSize;
				y = p.j * this.options.cellSize;
				this.renderPack(x, y, p.dir);
				return;
			} else {
				this.renderPackMotion(di, dj, id);
			}
		}

		display.renderPackMotion = function(di, dj, id) {
			if(di != 0 && dj != 0) return false; // ?? rendering is stop
			var x,y,xf,yf,xt,yt,xm,ym,i,j,d,rate,dRate,cntRate = 0, timer
			,that = this
			,p = that.packPos[id]
			,size = this.options.cellSize;
			xf = p.i * size; // coordinate x : from
			yf = p.j * size;
			xt = (p.i + di) * size; // coordinate x : to
			yt = (p.j + dj) * size;
			xm = di != 0? di : 0;
			ym = dj != 0? dj : 0;
			x = xf;
			y = yf;
			rate = this.options.frameRate;
			dis = Math.abs(di != 0? di : dj) * size; // distance
			dRate = Math.floor(rate / dis); 
			timer = setInterval(function(){
					that.motionLock = true;
					if(cntRate >= (dis - 1)) {
						clearInterval(timer);
						that.motionLock = false;
					}
					that.clearPack(x, y);
					x += xm;
					y += ym;
					that.renderPack(x, y, p.dir);
					cntRate++;
				}, dRate);
			p.i += di;
			p.j += dj;
		}

		display.getPackPos = function(di, dj, id) {
			var dir;
			if(di > 0) { // decide direction of pack face
				dir = 'right';
			} else if(di < 0) {
				dir = 'left';
			} else if(dj < 0) {
				dir = 'up';
			} else if(dj > 0) {
				dir = 'down';
			} else {
				dir = this.packPos[id].dir;
			}

			return dir;
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
					if (!display.checkBrowser()) {
						return false;
					}
					display.draw();
				}

			})($);


