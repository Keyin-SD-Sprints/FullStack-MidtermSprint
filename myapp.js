/* 
File: myApp.js
Purpose: The main routines to start the initialization app

Commands:
see usage.txt file

Date: 2023/6/19
*/

global.DEBUG = false;

const fs = require("fs");
const { initializeApp } = require("./initialize.js");
const { configApp } = require("./config.js");
const { tokenApp } = require("./token.js");
const Logger = require("./logger");
const server = require("./webServer.js");

const lg = new Logger();
lg.listen();

const myArgs = process.argv.slice(2);
const myArg = myArgs[0];
if (DEBUG) if (myArgs.length >= 1) console.log("myapp.args:", myArgs);

switch (myArg) {
  case "init":
  case "i":
    if (DEBUG) console.log(myArg, "-initialize app.");
    initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(myArg, "-display config file.");
    configApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(myArg, "-generate user token.");
    tokenApp();
    break;
  case "--server":
  case "--s":
    server();
    break;
  case "--help":
  case "--h":
  default:
    try {
      if (!fs.existsSync(`${__dirname}/views/usage.txt`))
        throw new Error(`${__dirname}\\views\\usage.txt doesn't exist.`);
      fs.readFile(`${__dirname}/views/usage.txt`, (error, data) => {
        console.log(data.toString());
      });
    } catch (error) {
      let msg = `There was a problem loading help files: ${error}`;
      console.error(msg);
      lg.emit("log", ".myapp()", "ERROR", msg);
      console.log("Recomend run: node myapp init --all");
    }
}
