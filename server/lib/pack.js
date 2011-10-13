/**
 * Pack Object
 */

/* Load library */
var sys = require('sys');
var env = require('./env').env;
var stage = require('./stage').stage;

var id = 0;

exports.Pack = function(con, id, x, y, teamName) {
	this.con = con;
	this.x = x || env.DEFAULT_PACK_X;
	this.y = y || env.DEFAULT_PACK_Y;
	this.point = 0;
	this.item = 0;
	this.isWall = false; // Whether last step is wall or not.
	this.status = env.PACK_STATUS.CLIENT_INIT;
	this.id = id++;
}

exports.Pack.prototype.changeState = function(state) {
	this.status = state;
	this.send('state', state);
}

exports.Pack.prototype.getX = function() {
	return this.x;
}
exports.Pack.prototype.getY = function() {
	return this.y;
}
exports.Pack.prototype.getId = function() {
	return this.id;
}
exports.Pack.prototype.setId = function(id) {
	this.id = id;
}
exports.Pack.prototype.next = function(arg) {
	this.send('next', arg);
}
exports.Pack.prototype.moveError = function(arg) {
	this.send('moveError', arg);
}
exports.Pack.prototype.move = function(msg) {
	var x = msg.i;
	var y = msg.j;

	/*
	 * ステージ上の移動前の自分の位置を消し, 新たに移動後の位置を登録する
	 */
	stage.cells[this.x][this.y][env.STAGE_OBJECTS.PACK] -= Math.pow(2,this.id);
	stage.cells[x][y][env.STAGE_OBJECTS.PACK] += Math.pow(2,this.id);
	this.isWall = false;

	// 位置更新
	this.x = x;
	this.y = y;
}
exports.Pack.prototype.send = function(ope, arg) {
	this.con.sendUTF(this.createMsg(ope, arg));
}
exports.Pack.prototype.render = function(stage) {
	this.send('render', stage);
}
exports.Pack.prototype.createMsg = function(ope, arg) {
	var msg = {
		ope:ope,
		arg:arg
	};
	return JSON.stringify(msg);
}
exports.Pack.prototype.createPackGhost = function(msg) {
	var pack = {};
	pack.x = this.x;
	pack.y = this.y;
	pack.id = this.id;
	pack.isWall = this.isWall;
	return pack;
}

