#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(9000, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var connections = {};
var connectionIDCounter = 0;

// Broadcast to all open connections
function broadcast(data) {
    Object.keys(connections).forEach(function(key) {
        var connection = connections[key];
        if (connection.connected) {
            connection.send(data);
        }
    });
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + 'rejected.');
      return;
    }

    var connection = request.accept('echo', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.id = connectionIDCounter ++;
    connections[connection.id] = connection;

    connection.on('message', function(message) {
        console.log('Received Message: ' + message.utf8Data);
        broadcast(message.utf8Data);
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + 'disconnected.');
        delete connections[connection.id];
    });
});
