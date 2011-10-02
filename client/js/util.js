var util = {};
(function($) {
    util.createMsg = function(ope, arg) {
      var msg = {
        ope:ope,
        arg:arg
      };
      return JSON.stringify(msg);
    }

	// whether a browser suport html5 canvas tag
	util.checkBrowser = function () {
		if ( ! this.canvas || ! this.canvas.getContext ) {
			console.log("This browser unsupported HTML5.");
			return false;
		} else {
			return true;
		}
	}


  })();
