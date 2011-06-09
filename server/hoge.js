var sys = require('sys'),
http = require('http'),
io = require('socket.io');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.finish();
}).listen(8000);


sys.puts('Server running');
