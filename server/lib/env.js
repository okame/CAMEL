var sys = require('sys');

exports.env = {
	PACK_NUM : 1,
	STAGE_WIDTH :20,
	STAGE_OBJECTS : {
		BLOCK:0,
		PACK:1,
		FEED:2,
		ITEM:3
	},
	STAGE_WIDTH : 20,
	DEFAULT_PACK_X:1,
	DEFAULT_PACK_Y:1,
	stage: [],
	packs : {},

	STAGE_XSIZE : 20,
	STAGE_YSIZE : 20,
	STAGE_ZSIZE : 3,

	STAGE_BLOCK : 0,
	STAGE_PACKMAN : 1,
	STAGE_POINT : 2,

	BLOCK_EXIST : 1,
	BLOCK_H : 1,
	BLOCK_V : 2,
	BLOCK_RU : 3,
	BLOCK_LU : 4,
	BLOCK_RD : 5,
	BLOCK_LD : 6,

	FEED_BACK : {
		SUCS : 0,
		WALL : 1,
		INVM : 2
	},

	FRAME_RATE : 200,
	PORT : 8000,

	GAME_TIME : 1,

	PACK_STATUS : {
		NEW : 0,
		CLIENT_INIT : 1,
		READY_OK : 2,
		MOVE : 3,
		TURN_END: 4
	}
}

