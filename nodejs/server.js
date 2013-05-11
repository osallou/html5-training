var sys = require("sys"),
my_http = require("http");
my_http.createServer(function(req,res){

    if (req.method === 'OPTIONS') {
        // add needed headers
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = true;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
        // respond to the request
        res.writeHead(200, headers);
        res.end();
    } else if (req.method === 'GET') { // no data is coming
        msg = "Hello";
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write(msg);
        res.end();
    }


}).listen(8080);

sys.puts("Server Running on 8080");

