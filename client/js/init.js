$(document).ready(function() {
    client.init(pack.onOpen);
    client.setOperation('mv', pack.onMessage);
  });

