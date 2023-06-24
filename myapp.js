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
  case "--help":
  case "--h":
    if (DEBUG) console.log(myArg, "-help (command).");
  default:
    fs.readFile(`${__dirname}/usage.txt`, (error, data) => {
      if (error) throw error; // polish this up perhaps. try/catch block.
      console.log(data.toString());
    });
}
