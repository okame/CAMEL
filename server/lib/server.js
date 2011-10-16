var util = require('util')
, env = require('./env').env
, WebSocketServer = require('websocket').server
, http
, server 
, port = env.PORT
, wsPram
, EVNT_NAME_CONNECT = 'connect'
, EVNT_NAME_CLOSE = 'close'
, EVNT_NAME_MESSAGE = 'message';

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

/**
 * 接続中のすべてのコネクションに対してmsgを送信.
 */
WebSocketServer.prototype.broadcast = function(msg) {
	this.connections.forEach(function(connection, i, arry){
			connection.sendUTF(msg);
		});
}

server = new WebSocketServer(wsParam);

/**
 * Eventの設定
 */
var setEvent = function(
	 connectEvnt
	,closeEvnt
	,messageEvnt
) {
	var connectEvnt = connectEvnt || function(){};
	var closeEvnt = closeEvnt || function(){};
	var messageEvnt = messageEvnt || function(){};

	server.on(EVNT_NAME_CLOSE, function(con){closeEvnt(con)});
	server.on(EVNT_NAME_CONNECT, function(con) {
			connectEvnt(con);
			con.on(EVNT_NAME_MESSAGE, function(msg){messageEvnt(con, msg)});
		});
}

/**
 * WebSocketサーバを返却
 */
var createServer = function(
	 connectEvnt
	,closeEvnt
	,messageEvnt
) {
	setEvent(connectEvnt, closeEvnt, messageEvnt);
	return server;
}

// -------------------
exports.createServer = createServer;
