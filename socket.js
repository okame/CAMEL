var sys = require('sys'),
http = require('http'),
ws = require('websocket-server');

var sv = ws.createServer();
var i = 0, j = 0;
var timer;

sv.listen(8000);

sv.addListener('connection', function(con){
    sys.log(con.id);

    var f = function() {
      d = Math.round(Math.random() * 2) - 1;
      if(Math.round(Math.random()) == 0) {
        i = d;
        j = 0;
      } else {
        i = 0;
        j = d;
      }
      sys.log(i+','+j);
      con.send('{"i":'+i+',"j":'+j+'}');
      timer = setTimeout(f, 50);
    }
    f();

    con.addListener('message', function(msg){
        sys.log(msg);
        con.send(msg);
    });

});


sys.puts('Server running');
