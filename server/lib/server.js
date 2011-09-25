var util = require('util')
, env = require('./env').env
, WebSocketServer = require('websocket').server
, http
, port = env.PORT
, wsPram;

http = require('http').createServer (
	function(request, response) {
		response.writeHead(404);
		response.end();
	}
);

http.listen(port, function() {
	util.log('server listening on port ' + port +'.');
});

wsParam = {
	 httpServer : http
	,autoAcceptConnections : true
};

WebSocketServer.prototype.broadcast = function(msg) {
	this.connections.forEach(function(connection, i, arry){
			connection.sendUTF(msg);
		});
}

exports.server = function() {
	return (new WebSocketServer(wsParam));
}

