/**
 * renderUtil.js
 *
 * dep:
 * 	option.js
 *
 */

renderUtil = {};

(function($) {

		/**
		 * Initialize.
		 * @param ctx canvas 2D context.
		 */
		renderUtil.init = function(ctx) {
			this.ctx = ctx;
		}

		/**
		 * stroke line from (x1, y1) to (x2, y2)
		 * default line color : black
		 * @param x1 path from
		 * @param y1 path from
		 * @param x1 path to
		 * @param y1 path to
		 * @param color
		 */
		renderUtil.stroke = function(x1, y1, x2, y2, color) {
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

		/**
		 * Render circle onto canvas.
		 * @param rx pivot.x
		 * @param ry pivot.y
		 * @param r radius
		 * @param color
		 */
		renderUtil.circle = function(rx, ry, r, color) {
			var ctx = this.ctx
			, color = color || OPTIONS.packColor;
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(rx, ry, r, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
		}

		/**
		 * Render rectangle onto canvas.
		 * @param x
		 * @param y
		 * @param color
		 */
		renderUtil.rect = function(x, y, color) {
			var ctx = this.ctx
			, color = color || OPTIONS.packColor
			, size = OPTIONS.cellSize;
			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, size, size);
			this.ctx.fillStyle = "";
		}

		renderUtil.clearRect = function (x, y) {
			var size = OPTIONS.cellSize;
			this.ctx.fillStyle = OPTIONS.bgColor;
			this.ctx.clearRect(x,y,size,size);
			this.ctx.fillStyle = "";
		}

		/**
		 * Render stage line.
		 */
		renderUtil.line = function (x, y, color, dir) {
			var size = OPTIONS.cellSize
			, xs , ys , xe , ye
			, color = color || OPTIONS.frameColor
			, lineWidth = OPTIONS.lineWidth;

			if(dir == CONSTANT.BLOCK.H) {
				xs = x;
				ys = y + size/2;
				xe = x + size;
				ye = ys;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
			} else if(dir == CONSTANT.BLOCK.V){
				xs = x + size/2;
				ys = y;
				xe = xs;
				ye = y + size;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
			} else if(dir == CONSTANT.BLOCK.RD){
				xs = x + size/2;
				ys = y + size/2;
				xe = x + size;
				ye = ys;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
				xs = x + size/2;
				ys = y + size/2;
				xe = xs;
				ye = y + size;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
			} else if(dir == CONSTANT.BLOCK.LD){
				xs = x + size/2;
				ys = y + size/2;
				xe = x;
				ye = ys;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
				xs = x + size/2;
				ys = y + size/2;
				xe = xs;
				ye = y + size;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
			} else if(dir == CONSTANT.BLOCK.RU){
				xs = x + size/2;
				ys = y + size/2;
				xe = x + size;
				ye = ys;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
				xs = x + size/2;
				ys = y + size/2;
				xe = xs;
				ye = y;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
			} else if(dir == CONSTANT.BLOCK.LU){
				xs = x + size/2;
				ys = y + size/2;
				xe = x;
				ye = ys;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
				xs = x + size/2;
				ys = y + size/2;
				xe = xs;
				ye = y;
				this.stroke(xs, ys, xe, ye, color, lineWidth);
			}

			this.ctx.fillStyle = "";
		}



	})($);
