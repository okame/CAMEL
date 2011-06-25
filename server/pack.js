var id = 0;

exports.Pack = function(con, x, y, v) {
  this.con = con;
  this.x = x||0;
  this.y = y||0;
  this.v = v||1;
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
  return this.con.id;
}
exports.Pack.prototype.next = function() {
  this.send('next','');
}
exports.Pack.prototype.move = function(msg) {
  this.x = msg.i;
  this.y = msg.j;
}
exports.Pack.prototype.send = function(ope, arg) {
  this.con.send(this.createMsg(ope, arg));
}
exports.Pack.prototype.createMsg = function(ope, arg) {
  var msg = {
    ope:ope,
    arg:arg
  };
  return JSON.stringify(msg);
}
exports.Pack.prototype.parseMsg = function(msg) {
      var msgb = JSON.parse(msg);
      req = {};
      req.ope  = msgb.ope;
      req.data = msgb.arg || '';
      return req;
    };

