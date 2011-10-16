/**
 * referee Object
 * type : Object
 */
var referee = {}

/* Load library */
var sys = require('sys');
var util = require('util');
var env = require('./env').env;

/* ------------------------------
 * Member variables
  ------------------------------ */
referee.packs = [];
referee.stage = {};


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
 * return { false : invalid, true : valid}
 */
referee.checkNextCell = function(id, x, y){

	//check out of stage
	if(!(x > 0 && x < env.STAGE_XSIZE - 1 && y > 0 && y < env.STAGE_YSIZE - 1)){
		sys.log('Cant move to out of stage.x='+x+',y='+y+'(id='+id+')');
		return env.FEED_BACK.WALL;
	}

	//check wall
	if(this.stage.cells[x][y][env.STAGE_OBJECTS.BLOCK] == env.BLOCK_EXIST){
		//block
		sys.log('Cant move into block.x='+x+',y='+y+'(id='+id+')');
		return env.FEED_BACK.WALL;
	}

	//check next step
	if(!this.checkNextStep(id, x, y)){
		sys.log('[Error] invalid movement.(id='+id+')');
		return env.FEED_BACK.INVM;
	}

	return env.FEED_BACK.SUCS;
}

/**
 * Check whether next step call is valid.
 * -> next cell must be a adjacent cell
 */
referee.checkNextStep = function(id, x, y){
	var pack = this.packs[id]
	, dx, dy;

	dx = Math.abs(pack.x - x);
	dy = Math.abs(pack.y - y);

	if((dx + dy) > 1) {
		return false;
	}else{
		return true;
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
referee.calcPoint = function(num){
	var i = 0
	, j = 0
	, k = 0
	, procMap = {}
	, pack
	, occupancy
	, point
	, dividePoint
	, id;


	for(i=0; i<env.PACK_NUM; i++){
		procMap[i] = false;
	}

	//calculate point
	for(i=0; i<env.PACK_NUM; i++){

		if(procMap[i]) {
			// console.log(i+':continue by proc.', pack.x, pack.y);
			continue;
		}

		duplicatePackIds = [];
		pack = this.packs[i];
		occupancy = this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.PACK] || 0;
		point = this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.FEED] || 0;
		dividePoint = 0;

		//If no point
		if(point == 0) {
			// console.log(i+':continue by no point.', pack.x, pack.y);
			continue;
		}

		//If existing point
		
		// remove feed from pList
		if(this.stage.pList[pack.x.toString()+pack.y.toString()]) {
			delete this.stage.pList[pack.x.toString()+pack.y.toString()];
		}

		//check if there're packs of same position
		for(j = i + 1; j < env.PACK_NUM; j++){
			// 現在のパックマンの位置に別のパックマンが存在した場合
			if((occupancy & Math.pow(2, j)) != 0 ){
				duplicatePackIds.push(j);
				procMap[j] = true; // 処理済みとしてマーク
			}
		}

		//If there're same cell packs
		if(duplicatePackIds.length != 0){
			duplicatePackIds.push(i);
			dividePoint = point / duplicatePackIds.length;

			/*
			console.log('debug(dividePoint)='+dividePoint);
			sys.log('devide packs :' + util.inspect(duplicatePackIds));
			console.log('get point id='+i);
			*/

			// 分割ポイントを付与
			for( k in duplicatePackIds ){
				id = duplicatePackIds[k];
				this.packs[id].point += dividePoint;
			}

		} else {
			this.packs[i].point += point;
		}


		// 餌の削除
		this.stage.cells[pack.x][pack.y][env.STAGE_OBJECTS.FEED] = 0;

	}

}

/**
 * get pack who has the most amount of points.
 */
referee.judgeWinner = function() {
	var id
	, winner = {}
	, packs = this.packs;
	winner.point = 0;
	winner.id = 0;

	for(id in packs) {
		if(packs[id].point > winner.point) {
			winner.id = id;
			winner.point = packs[id].point;
		}
	}

	return winner;
}

//------------------------
exports.referee = referee;
