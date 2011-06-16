$(document).ready(function() {

    // sample operations
    var echo = function(data) {
      console.log(data);
    }
    var ready = function() {
      var msg = {"ope":"client_ready","arg":""};
      console.log('client ready');
    }
    //client.init(pack.onOpen);
    client.init();
    client.setOperation('ready', ready);
  });

