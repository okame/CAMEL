var client = {};

(function($) {
    client.con = {};
    client.operations = {};
    client.init = function(init) {
      this.con = new window.WebSocket('ws://localhost:8000');
      this.con.onopen = function(e) {
        console.log('connecting');
        if(init) return init();
      };
      this.con.onmessage = function(msg) {
        var that = client;
        var buf = JSON.parse(msg.data);
        var ope = buf.ope || '';
        var arg = buf.arg || '';
        if(that.operations[ope]) that.operations[ope](arg);
      };

    }
    client.setOperation = function(name, f) {
      client.operations[name] = f;
    }
    client.cmd = function(msg) {
      this.con.send(msg);
    }
    client.evs = function() {
      var req = {ope:"evs",arg:""};
      this.cmd(JSON.stringify(req));
    }
    client.eve = function() {
      var req = {ope:"eve",arg:""};
      this.cmd(JSON.stringify(req));
    }

  })($);
