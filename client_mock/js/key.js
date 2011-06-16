var key = {};
(function($) {
    key.init = function() {
      $(document).keydown(function(event) {
          var key = event.keyCode;
          if(key == 37) {
            //console.log('left');
            pack.movePack(-1,0);
          } else if(key == 38) {
            //console.log('up');
            pack.movePack(0,-1);
          } else if(key == 39) {
            //console.log('right');
            pack.movePack(1,0);
          } else if(key == 40) {
            //console.log('down');
            pack.movePack(0,1);
          }
        })
    }
  })($);
