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

const myArgs = process.argv.slice(2);

function initializeApp() {
  if (DEBUG) console.log("-initializeApp() running...");

  switch (myArgs[1]) {
    case "--all":
      if (DEBUG) console.log(myArgs[1], "-creating files and folders");
      break;
    case "--mk":
      if (DEBUG) console.log(myArgs[1], "-creating all folders");
      break;
    case "--cat":
      if (DEBUG) console.log(myArgs[1], "-creating all files");
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

module.exports = {
  initializeApp,
};
