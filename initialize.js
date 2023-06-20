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
const path = require("path");
const fsP = require("fs").promises;

const lg = new Logger();
lg.listen();

const myArgs = process.argv.slice(2);
const myArg = myArgs[1];
function initializeApp() {
  if (DEBUG) console.log("-initializeApp() running...");
  //   lg.emit("log", "initializeApp()", "INFO", "initialize app **test log.");
  switch (myArg) {
    case "--all":
    case "--a":
      if (DEBUG) console.log(myArg, "-creating files and folders");
      //   createFolders();
      //   createFiles();
      break;
    case "--mk":
    case "--m":
      if (DEBUG) console.log(myArg, "-creating all folders");
      createDirs();
      break;
    case "--cat":
    case "--c":
      if (DEBUG)
        console.log(myArg, "-creating default config file and the help files");
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

// suspect logs for dir creation bug. When go through if logs isn't leading folder
// it will be created when emit "log" when any of the dirs in the list already exist
// because it goes to the catch of the try block which includes an emit
// then when it gets to it later in list it's already there.
//
// moral is to put the logs up front and make sure no 'log' emits come in front of calling createDirs() in the mk branch of the
// switch if you ever want this to say "All directories created".
const dirs = ["logs", "models", "views", "routes", "json"]; //temporarily here. will be moved to template file later on.

function createDirs() {
  if (DEBUG) console.log("init.createDirs()");
  let mkCount = 0;
  let made = [];
  dirs.forEach((dir) => {
    try {
      if (!fs.existsSync(path.join(__dirname, dir))) {
        fsP.mkdir(path.join(__dirname, dir));
        mkCount++;
        made.push(dir);
      }
    } catch (error) {
      console.log(`Error creating directory '${dir}': ` + error);
      lg.emit(
        "log",
        "init.createDirs()",
        "WARNING",
        `Error creating directory '${dir}': ` + error
      );
    }
  });
  if (mkCount === 0) {
    console.log("All directories already exist.");
    lg.emit(
      "log",
      "init.createDirs()",
      "INFO",
      "All directories already exist."
    );
  } else if (mkCount < dirs.length) {
    console.log(`${mkCount}/${dirs.length} directories created: [${made}]`);
    lg.emit(
      "log",
      "init.createDirs()",
      "INFO",
      `${mkCount}/${dirs.length} directories created: [${made}]`
    );
  } else {
    console.log("All directories created");
    lg.emit(
      "log",
      "init.createDirs()",
      "INFO",
      `All directories created: [${made}]`
    );
  }
}

function createFiles() {
  if (DEBUG) console.log("init.createFiles()");
}

module.exports = {
  initializeApp,
};
