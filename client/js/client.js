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
        if(e.data && f) {
          f(e.data);
        } else {
          console.log('no server msg or undefined event function.');
        }
      };
    }

    client.cmd = function(msg) {
      this.con.send(msg);
    }

  })($);
