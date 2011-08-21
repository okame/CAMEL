/**
 * referee Object
 * type : Object
 */
var referee = {}

/* Load library */
var sys = require('sys');
var env = require('./env').env;

/* ------------------------------
 * Member variables
  ------------------------------ */
referee.paks = [];
referee.stage = [];


/* ------------------------------
 * Methods
  ------------------------------ */

/**
 * Initialize the referee object
 */
referee.init = function(packs, stage) {
	this.packs = packs;
	this.stage = stage;
}

/**
 * Check whether the packs[id] can step to {x, y}
 * return success { false : invalid, true : valid}
 */
referee.checkNextCell = function(id, x, y){
	var success = true;

	//check out of stage
	if( x > 0 && x < env.STAGE_XSIZE - 1 && 
		y > 0 && y < env.STAGE_YSIZE - 1 ){
		//OK	
	}else{
		sys.log('Cant move to out of stage.x='+x+',y='+y+'(id='+id+')');
		success = false;
	}

	//check wall
	if( success && this.stage.cells[x][y][env.STAGE_OBJECTS.BLOCK]==env.BLOCK_EXIST_YES){
		//block
		sys.log('Cant move for block.x='+x+',y='+y+'(id='+id+')');
		success = false;
	}

	//check next step
	if( success && !this.checkNextStep(id, x, y) ){
		sys.log('No exist packman.(id='+id+')');
		success = false;
	}

	return success;
}

/**
 * Check whether next step call is valid.
 * -> next cell must be a adjacent cell
 */
referee.checkNextStep = function(id, x, y){
	var pack = this.packs[id];

	// change to smart one
	if( pack.x == x && pack.y == y ||
		pack.x-1 == x && pack.y == y ||
		pack.x == x && pack.y-1 == y ||
		pack.x+1 == x && pack.y == y ||
		pack.x == x && pack.y+1 == y){
		return true;
	}else{
		return false;
	}
}


/**
 * Print point info as like under the format.
 * --------------------------------
 * 17 Aug 22:21:38 - point=0(id=0)
 * 17 Aug 22:21:38 - point=10(id=1)
 * --------------------------------
 *
 */
referee.printPoint = function() {
	var i;
	for(i = 0; i < env.PACK_NUM; i++){
		sys.log('point='+this.packs[i].point+'(id='+i+')');
	}

}

/**
 * Calcurate pack's point at turn end.
 */
referee.calcPoint = function(){
	var i = 0, j = 0;
	var pointDividePackmanIdArray = [];
	var pack, packmanExist, point, dividePoint, id;

	//calculate point
	for(i=0; i<env.PACK_NUM; i++){

		pointDividePackmanIdArray = [];
		pack = this.packs[i];
		packmanExist = this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.PACK];
		point = this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.FEED];
		dividePoint = 0;

		//If no point
		if(this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.FEED]==0){
			continue;
		}

		//If existing point
		for(j=i; (packmanExist != 0) && (j<env.PACK_NUM); j++){
			if( ( packmanExist & Math.pow(2,j) ) != 0 ){
				packmanExist = packmanExist - Math.pow(2,j);
				pointDividePackmanIdArray.push(j);
			}
		}

		//If there're same cell packs
		if(pointDividePackmanIdArray.length != 0){
			dividePoint = point / pointDividePackmanIdArray.length;
			sys.log('debug(dividePoint)='+dividePoint);
		}

		for( i in pointDividePackmanIdArray ){
			id = pointDividePackmanIdArray[i];
			this.packs[id].point = this.packs[id].point + dividePoint;
			this.packs[id].sumPoint = this.packs[id].sumPoint + dividePoint;
		}

		this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.FEED] = 0;

	}

}

//------------------------
exports.referee = referee;
