var id = 0;

// TODO
// Task division between pack and controller
exports.Pack = function(con, x, y, v) {
  this.con = con;
  this.x = x||0;
  this.y = y||0;
  this.v = v||1;
  this.id = id++;
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
exports.Pack.prototype.next = function() {
  this.send('next', '');
}
exports.Pack.prototype.move = function(msg) {
  this.x = this.x + msg.i;
  this.y = this.y + msg.j;
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

