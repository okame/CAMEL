/**
 * Pack.js
 *
 * dep :
 *
 * member :
 * 	i
 * 	j
 * 	dir
 * 	r : pack size radius.
 * 	msize : mouth size (radian).
 * 	motionLock
 * 	ctx : canvas
 *
 * method :
 *
 *
 */

var Pack = function(i, j, dir, ctx) {
	this.i = i;
	this.j = j;
	this.dir = dir;
	this.ctx = ctx;

	// init
	this.r = (OPTIONS.cellSize-1)/2
	this.msize = Math.PI/6;

}

Pack.prototype.movePack = function(di, dj) {
	var p = this
		, x = this.x
		, y = this.y
		, pNext = {};

	pNext.i = p.i + di;
	pNext.j = p.j + dj;

	p.dir = this.getPackPos(di, dj) || p.dir;

	//check frame, stage and motion lock
	if(pNext.i < 0 || pNext.j < 0 || this.motionLock) {
		return false;
	} else if(di == 0 && dj == 0) {
		x = p.i * OPTIONS.cellSize;
		y = p.j * OPTIONS.cellSize;
		this.renderPack(x, y, p.dir);
		return;
	} else {
		this.renderPackMotion(di, dj);
	}

}

/**
 * render pack at {x, y}:pixel with pack's direction.
 */
Pack.prototype.renderPack = function (x, y) {
	var size = OPTIONS.cellSize
		, rx = x + size/2
		, ry = y + size/2
		, mths
		, mthe;

	//render circle
	this.ctx.fillStyle = OPTIONS.packColor;
	this.ctx.beginPath();
	this.ctx.arc(rx, ry, this.r, 0, Math.PI * 2, true);
	this.ctx.fill();
	this.ctx.closePath();

	if(this.dir == 'left') {
		mths = Math.PI + this.msize;
		mthe = Math.PI - this.msize;
	} else if(this.dir == 'down') {
		mths = Math.PI / 2 + this.msize;
		mthe = Math.PI / 2 - this.msize;
	} else if(this.dir == 'right') {
		mths = this.msize;
		mthe = 2 * Math.PI - this.msize;
	} else if(this.dir == 'up') {
		mths = Math.PI * 3 / 2 + this.msize;
		mthe = Math.PI * 3 / 2 - this.msize;
	} else {
		return false;
	}

	//erase mouth region
	this.ctx.fillStyle = OPTIONS.bgColor;
	this.ctx.beginPath();
	this.ctx.arc(rx, ry, this.r, mths, mthe, true);
	this.ctx.fill();
	this.ctx.closePath();
	this.ctx.beginPath();
	this.ctx.moveTo(rx, ry);
	this.ctx.lineTo(rx + this.r * Math.cos(mths), ry + this.r * Math.sin(mths));
	this.ctx.lineTo(rx + this.r * Math.cos(mthe), ry + this.r * Math.sin(mthe));
	this.ctx.closePath();
	this.ctx.fill();

	this.ctx.fillStyle = "";
}


/**
 * render pack's animation.
 */
Pack.prototype.renderPackMotion = function(di, dj) {
	if(di != 0 && dj != 0) return false; // rendering is stop
	var x, y
		, xf, yf
		, xt, yt
		, xm, ym
		, i, j
		, d
		, rate
		, dRate
		, cntRate = 0
		, p = this
		, size = OPTIONS.cellSize
		, timer;

	rate = OPTIONS.frameRate;
	dis = Math.abs(di != 0? di : dj) * size; // distance
	dRate = Math.floor(rate / dis); 
	xf = p.i * size; // coordinate : from
	yf = p.j * size;
	xt = (p.i + di) * size; // coordinate : to
	yt = (p.j + dj) * size;
	xm = di != 0? di : 0; // an amount of movement
	ym = dj != 0? dj : 0;
	x = xf;
	y = yf;
	timer = setInterval(function(){
			p.motionLock = true;
			/* stop motion */
			if(cntRate >= (dis - 1)) { 
				clearInterval(timer);
				p.motionLock = false;
			}
			p.clearPack(x, y);
			x += xm;
			y += ym;
			p.renderPack(x, y, p.dir);
			cntRate++;
			}, dRate);
	p.i += di;
	p.j += dj;
}

/**
 * Clear canvas at a cell of Pack.
 */
Pack.prototype.clearPack = function (x, y) {
	var size = OPTIONS.cellSize;
	this.ctx.fillStyle = OPTIONS.bgColor;
	this.ctx.clearRect(x, y, size, size);
	this.ctx.fillStyle = "";
}

Pack.prototype.getPackPos = function(di, dj) {
	var dir;
	if(di > 0) { // decide direction of pack face
		dir = 'right';
	} else if(di < 0) {
		dir = 'left';
	} else if(dj < 0) {
		dir = 'up';
	} else if(dj > 0) {
		dir = 'down';
	}

	return dir;
}

