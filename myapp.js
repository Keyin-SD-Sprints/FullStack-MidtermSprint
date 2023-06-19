/* 
File: myApp.js
Purpose: The main routines to start the initialization app

Commands:
see usage.txt file

Date: 2023/6/19
*/

global.DEBUG = true;

const fs = require("fs");

const myArgs = process.argv.slice(2);
if (DEBUG) if (myArgs.length >= 1) console.log("myApp.args:", myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], "-initialize app.");
    // initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(myArgs[0], "-display config file.");
    // configApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(myArgs[0], "-generate user token.");
    // tokenApp();
    break;
  case "--help":
  case "--h":
    if (DEBUG) console.log(myArgs[0], "-help (command).");
  default:
    fs.readFile(`${__dirname}/usage.txt`, (error, data) => {
      if (error) throw error; // polish this up perhaps. try/catch block.
      console.log(data.toString());
    });
}
