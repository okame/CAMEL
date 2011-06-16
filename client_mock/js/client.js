var client = {};

(function($) {
    client.con = {};
    client.operations = {};
    client.init = function(init) {
      var that = this;

      this.con = new window.WebSocket('ws://localhost:8000');

      this.operations = {
        synack:function() {
          console.log('get synack message');
          that.con.send(that.createMsg('ack',''));
        }
      };

      this.con.onopen = function(e) {
        console.log('connecting');
        client.con.send(that.createMsg('syn',''));
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
      this.cmd(this.createMsg('evs',''));
    }
    client.eve = function() {
      this.cmd(this.createMsg('eve',''));
    }

    client.createMsg = function(ope, arg) {
      var msg = {
        ope:ope,
        arg:arg
      };
      return JSON.stringify(msg);
    }
  })($);
