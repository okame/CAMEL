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

/**
 * Constructor.
 */
var Pack = function(i, j, dir, ctx) {
	this.i = i;
	this.j = j;
	this.dir = dir;
	this.ctx = ctx;

	// init
	this.r = (OPTIONS.cellSize-1)/2
	this.msize = Math.PI/6;
	this.mouth = CONSTATNT.MOUTH.MATER;
}

/**
 * PakPak Lotation.
 */
Pack.prototype.lotate = [
	  CONSTATNT.MOUTH.MATER
	, CONSTATNT.MOUTH.SMALL
	, CONSTATNT.MOUTH.LARGE
	, CONSTATNT.MOUTH.SMALL
];

Pack.prototype.gifTimer;
Pack.prototype.gifStart = function(dir) {
	Pack.prototype.gifTimer = setInterval(function() {
			Pack.prototype.mouthNo = (Pack.prototype.mouthNo >= (Pack.prototype.lotate.length - 1)? 0 : (Pack.prototype.mouthNo + 1));
		}, OPTIONS.gifTime);
};

/**
 * PakPak imgs.
 */
Pack.prototype.mouthNo = 0;
Pack.prototype.imgs = {};
Pack.prototype.imgs['master'] = new Image()
Pack.prototype.imgs['right_s'] = new Image()
Pack.prototype.imgs['right_l'] = new Image()
Pack.prototype.imgs['down_s'] = new Image()
Pack.prototype.imgs['down_l'] = new Image()
Pack.prototype.imgs['left_s'] = new Image()
Pack.prototype.imgs['left_l'] = new Image()
Pack.prototype.imgs['up_s'] = new Image()
Pack.prototype.imgs['up_l'] = new Image()

for(key in Pack.prototype.imgs) {
	Pack.prototype.imgs[key].src = './img/'+key+'.png';
	Pack.prototype.imgs[key].onload = (function(key) {
			var key = key;
			return function(key) {
				//console.log('READ IMG : ' + key);
			};
		})(key);
}

/**
 * Move pack to {Pack.i+di, Pack.j+dj}
 */
Pack.prototype.movePack = function(di, dj) {
	var p = this
		, x = this.x
		, y = this.y
		, pNext = {};

	pNext.i = p.i + di;
	pNext.j = p.j + dj;

	p.dir = this.getPackDir(di, dj) || p.dir;

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

Pack.prototype.renderPackImg = function (x, y, img) {
	var size = OPTIONS.cellSize;
	this.ctx.drawImage(img, x, y, size, size);
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
			var index;
			p.motionLock = true;
			/* stop motion */
			if(cntRate >= (dis - 1)) { 
				clearInterval(timer);
				p.motionLock = false;
			}
			p.clearPack(x, y);
			x += xm;
			y += ym;
			// p.renderPack(x, y, p.dir);
			index = p.mouthNo == 0? 'master' : p.dir+'_'+p.lotate[p.mouthNo];
			p.renderPackImg(x, y, p.imgs[index]);
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

/**
 * Get pack direction based on pack's moving.
 */
Pack.prototype.getPackDir = function(di, dj) {
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

Pack.prototype.gifStart();
