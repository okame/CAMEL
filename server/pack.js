var id = 0;
var point = 0;
var sumPoint = 0;
var teamName = '';
var item = 0;
var status = 0;
var x=1;
var y=1;

exports.Pack = function(con, x, y, v) {
  this.con = con;
  this.x = x||1;
  this.y = y||1;
  id++;
}

exports.Pack.prototype.getX = function() {
  return this.x;
}
exports.Pack.prototype.getY = function() {
  return this.y;
}
exports.Pack.prototype.getV = function() {
  return this.v;
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
exports.Pack.prototype.move = function(msg) {
  this.x = msg.i;
  this.y = msg.j;
}
exports.Pack.prototype.send = function(ope, arg) {
  this.con.send(this.createMsg(ope, arg));
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
exports.Pack.prototype.createSendPack = function(msg) {
	var pack = {};
	pack.x = this.x;
	pack.y = this.y;
	pack.id = this.id;
	return pack;
}

