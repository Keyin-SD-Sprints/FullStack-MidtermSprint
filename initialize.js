/*
file: initialize.js

Commands:
myapp init --help                       displays help for the init command
myapp init --all                        creates the folder structure and the config and help files
myapp init --mk                         creates the folder structure
myapp init --cat                        creates the config file with default settings and the help files

date: 2023/06/19

*/
const fs = require("fs");
const Logger = require("./logger");

const lg = new Logger();
lg.listen();

const myArgs = process.argv.slice(2);
const myArg = myArgs[1];
function initializeApp() {
  if (DEBUG) console.log("-initializeApp() running...");
  lg.emit("log", "initializeApp()", "INFO", "initialize app **test log.");
  switch (myArg) {
    case "--all":
      if (DEBUG) console.log(myArg, "-creating files and folders");
      createFolders();
      createFiles();
      break;
    case "--mk":
      if (DEBUG) console.log(myArg, "-creating all folders");
      createFolders();
      break;
    case "--cat":
      if (DEBUG)
        console.log(
          myArg,
          "-creating default config file and the help help files"
        );
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(`${__dirname}/initialize.txt`, (error, data) => {
        if (error) throw error; // polish this up perhaps. try/catch block.
        console.log(data.toString());
      });
  }
}

function createFolders() {
  if (DEBUG) console.log("createFolders()");
}

function createFiles() {
  if (DEBUG) console.log("createFiles()");
}

module.exports = {
  initializeApp,
};
