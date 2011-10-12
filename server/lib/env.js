var sys = require('sys');

exports.env = {
	PACK_NUM : 4,
	STAGE_WIDTH :20,
	STAGE_OBJECTS : {
		BLOCK:0,
		PACK:1,
		FEED:2,
		ITEM:3
	},
	STAGE_WIDTH : 20,
	DEFAULT_PACK_X:2,
	DEFAULT_PACK_Y:1,
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

	BLOCK_EXIST_NO  : 0,
	BLOCK_EXIST_YES : 1,

	FRAME_RATE : 200,
	PORT : 8000,

	PACK_STATUS : {
		NEW : 0,
		CLIENT_INIT : 1,
		READY_OK : 2,
		MOVE : 3,
		TURN_END: 4
	}
}

