// require/enable http module
const http = require("http");

const Logger = require("./logger");
const { newToken } = require("./token.js");
const serveFile = require("./serveFile");

// logger instance + activation
const lg = new Logger();
lg.listen();

function server() {
  if (DEBUG) console.log("webServer.js running...");
  //using http module, create a server and store it in the variable 'server'
  const server = http.createServer((req, res) => {
    //Request handling logic
    let path = "./webpage/";
    const clientIP = req.socket.remoteAddress; // gets the client ip address
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
        // endpoint to access newToken function.
        path += "new-token";
        try {
          if (req.method === "POST") {
            let body = ""; //blank string to accumulate 'chunks'
            req.on("data", (chunk) => {
              body += chunk; //adds chunks to body as they come in
            });

            req.on("end", () => {
              //when 'end' is received
              const data = JSON.parse(body); //convert the string into json object
              const result = newToken(data.username); //run the newToken function with the received data (username from input on webpage)
              const response = {
                result: result, //store response as object
              };
              res.statusCode = 200;
              res.setHeader("Content-type", "application/json");
              res.end(JSON.stringify(response)); // send back the response to the client
            });
            let msg = `New token returned to web-user @ ${clientIP}`;
            console.log(msg);
            lg.emit("log", path, "INFO", msg);
          } else {
            res.statusCode = 404;
            res.end("Resource not found");
            let errorMsg = ``; //update
            console.log(errorMsg);
            lg.emit("log", path, "ERROR", errorMsg);
          }
        } catch (error) {
          let errorMsg = `There was a problem getting token for client @${clientIP}: ${error}`; //update
          console.log(errorMsg);
          lg.emit("log", path, "ERROR", errorMsg);
        }
        break;
      case "/favicon.ico":
        // eliminates error msging for favicon.ico.
        // didn't bother with any logging or anything here because it was more of a 'fix'.
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
