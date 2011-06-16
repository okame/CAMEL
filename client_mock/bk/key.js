var key = {};
(function($) {
    key.init = function() {
      $(document).keydown(function(event) {
          var key = event.keyCode;
          pack.matrix.pack[pack.p.x][pack.p.y] = false;
          if(key == 37) {
            //console.log('left');
            pack.p.x--;
          } else if(key == 38) {
            //console.log('up');
            pack.p.y--;
          } else if(key == 39) {
            //console.log('right');
            pack.p.x++;
          } else if(key == 40) {
            //console.log('down');
            pack.p.y++;
          }
          pack.matrix.pack[pack.p.x][pack.p.y] = true;
          pack.draw();
        })
    }
  })($);
