var fs = require('fs');
var fd;
var lineCnt = 0;
var bytes = 0;

exports.open = function(fileName) {
	fd = fs.openSync(fileName, 'r');
}

exports.close = function() {
	if(fd) {
		fs.closeSync(fd);
	}
	lineCnt = 0;
	bytes = 0;
}

exports.readLine = function() {
	var buffer
	, line = ''
	, bytesRead
	, data;
	while(buffer != '\n') {
		buffer = fs.readSync(fd, 1, bytes++, 'utf-8')[0];
		line += buffer;
	}
	lineCnt++;
	if(line.trim().length == 0)  {
		return false;
	}
	return line.trim();
}

exports.getLineCnt = function() {
	return lineCnt;
}
