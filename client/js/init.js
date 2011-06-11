$(document).ready(function() {
    pack.init();
    if (!pack.checkBrowser()) {
      return false;
    }
    pack.draw();
    //pack.movePack(1,0);
    //key.init();
    client.init();
    client.setOnMessage(pack.onMessage);
    //client.setOnMessage(function(p){console.log(p);});
  });

