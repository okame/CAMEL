var client = {};

(function($) {
    client.con = {};
    client.init = function() {
      this.con = new window.WebSocket('ws://localhost:8000');

      this.con.onopen = function(e) {
        console.log('connecting');
      };
    }
    
    client.setOnMessage = function(f){
      this.con.onmessage = function(e) {
        var p = eval('('+e.data+')');
        f(p);
      };
    }

  })($);
