var sys = require('sys');

exports.env = {
	PACK_NUM : 2,
	STAGE_WIDTH :20,
	STAGE_OBJECTS : {
		BLOCK:0,
		PACK:1,
		FEED:2,
		ITEM:3
	},
	STAGE_WIDTH : 20,
	DEFAULT_PACK_X:10,
	DEFAULT_PACK_Y:10,
	EMPTY_FLG:0,
	EXIST_FLG:1,
	stage: [],
	packs : {},

	STAGE_XSIZE : 20,
	STAGE_YSIZE : 20,
	STAGE_ZSIZE : 3,

	STAGE_BLOCK : 0,
	STAGE_PACKMAN : 1,
	STAGE_POINT : 2,

	BLOCK_EXIST_NO : 0,
	BLOCK_EXIST_YES  : 1

}

// Make stage mock
var env = exports.env;

env.stage = [];
var i, j, key;
for(i = 0;i<env.STAGE_WIDTH;i++) {
	env.stage[i] = [];
	for(j = 0;j<env.STAGE_WIDTH;j++) {
		env.stage[i][j] = [];
		for(key in env.STAGE_OBJECTS) {
			env.stage[i][j][env.STAGE_OBJECTS[key]] = env.EMPTY_FLG;
		}
	}
}

// Put block
env.stage[5][5][env.STAGE_OBJECTS.STAGE_BLOCK] = env.EXIST_FLG;
env.stage[10][7][env.STAGE_OBJECTS.STAGE_BLOCK] = env.EXIST_FLG;
env.stage[3][5][env.STAGE_OBJECTS.STAGE_BLOCK] = env.EXIST_FLG;
env.stage[5][3][env.STAGE_OBJECTS.STAGE_BLOCK] = env.EXIST_FLG;
env.stage[14][13][env.STAGE_OBJECTS.STAGE_BLOCK] = env.EXIST_FLG;

env.stage[14][13][env.STAGE_OBJECTS.STAGE_FEED] = env.EXIST_FLG;
