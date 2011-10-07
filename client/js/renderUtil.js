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

	})($);
