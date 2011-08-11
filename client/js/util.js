var util = {};
(function($) {
    util.createMsg = function(ope, arg) {
      var msg = {
        ope:ope,
        arg:arg
      };
      return JSON.stringify(msg);
    }

  })();
