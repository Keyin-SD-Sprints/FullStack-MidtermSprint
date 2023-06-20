/*
file: config.js

Commands:
myapp config --help                     displays help for the config command
myapp config --show                     displays a list of the current config settings
myapp config --reset                    resets the config file with default settings
myapp config --set <option> <value>     sets a specific config settings

date: 2023/06/20

*/

// load the logEvents module
const logEvents = require("./logger");

// define/extend an EventEmitter class
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on("log", (event, level, msg) => new logEvents(event, level, msg));

// common core modules
const fs = require("fs");

const myArgs = process.argv.slice(2);

function configApp() {
  if (DEBUG) console.log("-configApp() running...");
  myEmitter.emit("log", "configApp()", "INFO", "config option was called");

  switch (myArgs[1]) {
    case "--show":
      // displayConfig();
      console.log("Display config running...");
      break;
    case "--reset":
      // resetConfig();
      console.log("Reset config running...");
      break;
    case "--set":
      // setConfig();
      console.log("Set config running...");
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(`${__dirname}/config.txt`, (error, data) => {
        if (error) throw error; // polish this up perhaps. try/catch block.
        console.log(data.toString());
      });
  }
}

module.exports = {
  configApp,
};
