// require/enable http module
const http = require("http");
const Logger = require("./logger");
const { newToken } = require("./token.js");
const serveFile = require("./serveFile");

const lg = new Logger();
lg.listen();

function server() {
  //using http module, create a server and store it in the variable 'server'
  const server = http.createServer((req, res) => {
    //Request handling logic
    //log the request url
    // console.log(`Request url: ${req.url}\n`);
    let path = "./webpage/";
    const clientIP = req.socket.remoteAddress;
    let logMessage = "";
    //switch statement, allows for different routes based on the request url.
    switch (req.url) {
      case "/":
        //set response status code
        res.statusCode = 200;
        // set path for file
        path += "index.html";
        logMessage = `${clientIP} Connected to root page!`;
        // emit log event
        lg.emit("log", path, "INFO", logMessage);
        // get the file, compose response
        serveFile(path, res);
        break;
      case "/style":
        //set response status code
        res.statusCode = 200;
        // set path for file
        path += "style.css";
        logMessage = `${clientIP} accessed css!`;
        // emit log event
        lg.emit("log", path, "INFO", logMessage);
        // get the file, compose response
        serveFile(path, res);
        break;
      case "/new-token":
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });

          req.on("end", () => {
            const data = JSON.parse(body);
            const result = newToken(data.username);
            const response = {
              result: result,
            };

            res.setHeader("Content-type", "application/json");
            res.end(JSON.stringify(response));
          });
        } else {
          res.statusCode = 404;
          res.end("Resource not found");
        }
        break;
      case "/favicon.ico":
        res.statusCode = 204; // No Content
        res.end();
        break;
      default:
        //set response status code
        res.statusCode = 404;
        // set path for file
        path += "404.html";
        logMessage = `${clientIP} connected to 404 page!`;
        // emit log event
        lg.emit("log", path, "ERROR", logMessage);
        // get the file, compose response
        serveFile(path, res);
        break;
    }
  });

  const port = 3000;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = server;
