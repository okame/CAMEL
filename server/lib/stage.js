/**
 * Stage Object
 * type : Object
 */
var stage = {}

/* Load library */
var sys = require('sys');
var env = require('./env').env;

/* ------------------------------
 * Member variables
  ------------------------------ */
stage.cells = [];
/**
 * This is points data as list data type.
 */
stage.pList = {};

/* ------------------------------
 * Methods
  ------------------------------ */

/**
 * Initialize stage cells.
 */
stage.init = function() {

	var i, j, k;

	//Initialize cells array 
	for(i = 0; i < env.STAGE_XSIZE; i++){
		this.cells[i] = [];
		for(j = 0; j < env.STAGE_YSIZE; j++){
			this.cells[i][j] = [];
			for(k = 0; k < env.STAGE_ZSIZE; k++){
				this.cells[i][j][k] = 0;
			}
		}
	}

	/* Create edge as wall */
	// Vertical line
	for(i = 0; i < env.STAGE_XSIZE; i++){
		this.cells[i][0][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
		this.cells[i][env.STAGE_YSIZE-1][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
	}
	// Horizontal line
	for(i = 1; i < env.STAGE_YSIZE-1; i++){
		this.cells[0][i][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
		this.cells[env.STAGE_XSIZE-1][i][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
	}	

	this.debug();
	
	this.createPList();

	sys.log('finished to create stage');
}

/**
 * Print stage info as like under the figure.
 *
 * 111111
 * 100001
 * 100001
 * 100001
 * 111111
 *
 * where, 
 * 0:nothing
 * 1:wall
 *
 */
stage.printStageInfo = function() {

	for(i = 0; i<env.STAGE_YSIZE; i++){
		for(j = 0; j<env.STAGE_XSIZE; j++){
			sys.print(this.cells[j][i][env.STAGE_OBJECTS.BLOCK]);
		}
		sys.print('\n');
	}

}

/**
 * Making pList.
 * "pList" is points data as list data structure.
 */
stage.createPList = function() {
	var v;
	for(i = 0; i<env.STAGE_YSIZE; i++){
		for(j = 0; j<env.STAGE_XSIZE; j++){
			if(this.cells[j][i][env.STAGE_OBJECTS.FEED] > 0) {
				v = this.cells[j][i][env.STAGE_OBJECTS.FEED];
				this.pList[i.toString() + j.toString()] = v;
			}
		}
	}
}

/**
 * Getting number of pList entities.
 */
stage.getPListLength = function() {
	var k
		, cnt = 0
		, pList = this.pList;
	for(k in this.pList) {
		if(pList[k]) cnt++;
	}
	return cnt;
}

/**
 * return whether feed is empty,
 * checking this pList.
 */
stage.feedsIsEmpty = function() {
	if(this.getPListLength() == 0) {
		return true;
	} else {
		return false;
	}
}

//------------------------
exports.stage = stage;



/* DEBUG */
stage.debug = function() {

	var blocks = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	]
	, i, j;

	// Put point
	for(i=0; i<blocks.length; i++) {
		for(j=0; j<blocks[i].length; j++) {
			if(blocks[i][j] == 1) {
				this.cells[j][i][env.STAGE_OBJECTS.BLOCK] = env.BLOCK_EXIST_YES;
			} else if(blocks[i][j] == 9) {
				this.cells[j][i][env.STAGE_OBJECTS.FEED] = 1;
			}
		}
	}
}
