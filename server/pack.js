var id = 0;

exports.Pack = function(x, y, v) {
  this.x = x||0;
  this.y = y||0;
  this.v = v||1;
  this.id = id;
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
