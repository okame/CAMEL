var packSrv = {};

(function() {

    packSrv.con = {};
    packSrv.sys = require('sys');
    packSrv.http = require('http');
    packSrv.ws = require('websocket-server');
    packSrv.sv = packSrv.ws.createServer();
    packSrv.timer;
    packSrv.sv.listen(8000);
    packSrv.rate = 100;

    packSrv.init= function() {
      // param
      that = this;

      // ope
      this.operations = {
        echo:function() {
          that.sys.log('call echo');
        },
        hoge:function(con){
          con.send('{ope:mv,arg:{i:1,j:2}}');
          that.sys.log('call hoge');
        },

        // event start
        evs:function(con) {
          //that.evLoop.apply(packSrv, [con]);
          //that.evLoop(con);
          that.con  = con;
          that.timer = setInterval(packSrv.evLoop, that.rate);
        },

        // event stop
        eve:function() {
          clearInterval(that.timer);
        }

      }

      //add listener
      this.sv.addListener('connection', function(con){
          var i = 0, j = 0, d
          that.sys.log(con.id);
          this.con = con;

          var f = function() {
            d = Math.round(Math.random() * 2) - 1;
            if(Math.round(Math.random()) == 0) {
              i = d;
              j = 0;
            } else {
              i = 0;
              j = d;
            }
            this.sys.log(i+','+j);
            this.con.send('{"i":'+i+',"j":'+j+'}');
            this.timer = setTimeout(f, 50);
          }

          con.addListener('message', function(msg){
              that.sys.log(msg);
              var req = that.parseRequest(msg);
              if(req && that.operations[req.ope]) {
                that.operations[req.ope](con);
              } else {
                that.sys.log('Recieve invalid massge');
                con.send('Invalid massge');
              }
            });

        });

      this.sys.puts('Server running');
    };

    packSrv.evLoop = function() {
      var i = 0, j = 0, d;
      var con = packSrv.con;

      d = Math.round(Math.random() * 2) - 1;
      if(Math.round(Math.random()) == 0) {
        i = d;
        j = 0;
      } else {
        i = 0;
        j = d;
      }
      packSrv.sys.log(i+','+j);
      con.send('{"ope":"mv","arg":{"i":'+i+',"j":'+j+'}}');
    }

    packSrv.parseRequest = function(msg) {
      var msgb = msg.split(':'),
      req = {};
      if(msgb.length != 2) {
        return false;
      } else {
        req.ope  = msgb[0],
        req.data = msgb[1];
      }
      return req;
    };

  })();
packSrv.init();

