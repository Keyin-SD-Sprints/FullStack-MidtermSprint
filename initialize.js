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
const path = require("path");
// const fsP = require("fs").promises;

const Logger = require("./logger");
const { files, dirs } = require("./templates.js");

// instance of Logger + activation.
const lg = new Logger();
lg.listen();

// args from comand line.
const myArgs = process.argv.slice(2);
// the arg for the switch.
const myArg = myArgs[1];

async function initializeApp() {
  // CLI otions for init
  if (DEBUG) console.log("-initializeApp() running...");
  switch (myArg) {
    case "--all":
    case "--a":
      //initialize all files and folders.
      if (DEBUG) console.log(myArg, "-creating files and folders");
      const { mkCount, made } = await createDirs();
      await createDirsMsg(mkCount, made);
      createFiles();
      break;
    case "--mk":
    case "--m":
      //initialize all folders
      if (DEBUG) console.log(myArg, "-creating all folders");
      createDirs();
      break;
    case "--cat":
    case "--c":
      //create all files
      if (DEBUG)
        console.log(myArg, "-creating default config files and the help files");
      createFiles();
      break;
    case "--help":
    case "--h":
    default:
      //help or default.
      try {
        if (!fs.existsSync(`${__dirname}/views/init.txt`))
          throw new Error(`${__dirname}\\views\\init.txt doesn't exist.`);
        fs.readFile(`${__dirname}/views/init.txt`, (error, data) => {
          console.log(data.toString());
        });
      } catch (error) {
        let msg = `There was a problem loading help files: ${error}`;
        console.error(msg);
        lg.emit("log", ".myapp()", "ERROR", msg);
        console.log("Recomend run: node myapp init --all");
      }
  }
}

async function createDirs() {
  // create folders.
  if (DEBUG) console.log("initalize.createDirs()");
  let mkCount = 0; //tracks total number of folders created.
  let made = []; //tracks folder names that were created.
  dirs.forEach((dir) => {
    if (!fs.existsSync(path.join(__dirname, dir))) {
      try {
        fs.mkdirSync(path.join(__dirname, dir));
        let successMsg = `Directory '${__dirname}/${dir}' was created successfully.`;
        console.log(successMsg);
        lg.emit("log", "initialize.createDirs()", "INFO", successMsg);
        mkCount++; // Increment mkCount when directory is created
        made.push(dir); // add folder name to list of made folders.
      } catch (error) {
        let errorMsg = `Error creating directory '${dir}': ` + error;
        console.error(errorMsg);
        lg.emit("log", "initialize.createDirs()", "ERROR", errorMsg);
      }
    } else {
      let msg = `Directory '${__dirname}\\${dir}' already exists.`;
      console.log(msg);
      lg.emit("log", "initialize.createDirs()", "INFO", msg);
    }
  });
  return { mkCount, made };
}

async function createDirsMsg(mkCount, made) {
  if (DEBUG) console.log("initialize.createDirsMsg() running...");
  // does end log and messaging for createDirs.
  // did this to seperate them out because the logs were getting intermingled.
  let mkMsg = "";
  if (mkCount === 0) {
    mkMsg = "All directories already exist.";
  } else if (mkCount < dirs.length) {
    mkMsg = `${mkCount} of ${dirs.length} directories created: [${made}]`;
  } else {
    mkMsg = `All directories created (${mkCount} of ${dirs.length}): [${made}]`;
  }
  console.log(mkMsg);
  lg.emit("log", "initialize.createDirs()", "INFO", mkMsg);
}

async function createFiles() {
  //create files from template.js
  if (DEBUG) console.log("initalize.createFiles() running...");
  let jsonCount = 0; // tracks how many json files come in from the batch
  let txtCount = 0; // tracks how many text files (other files right now) come in from batch
  let jsonMkCount = 0; // tracks how many json files were created.
  let txtMkCount = 0; // tracks how many txt files were created.
  files.forEach((file) => {
    // changes handling depending on if json or txt.
    data =
      file.path === "json" ? JSON.stringify(file.data, null, 2) : file.data;
    // increments for overall batch file types.
    if (file.path === "json") {
      jsonCount++;
    } else {
      txtCount++;
    }
    if (!fs.existsSync(path.join(`${__dirname}/${file.path}/${file.name}`))) {
      try {
        fs.writeFileSync(`./${file.path}/${file.name}`, data);
        let msg = `Succesfully created file "${__dirname}\\${file.path}\\${file.name}"`;
        console.log(msg);
        lg.emit("log", "initialize.createFiles()", "INFO", msg);
        //increments for made file counts.
        if (file.path === "json") {
          jsonMkCount++;
        } else {
          txtMkCount++;
        }
      } catch (error) {
        // red alert!
        let msg = `Encountered an error writing file "${__dirname}\\${file.path}\\${file.name}": ${error}`;
        console.error(msg);
        lg.emit("log", "init.createFiles()", "ERROR", msg);
      }
    } else {
      // when file already exists
      let msg = `"${__dirname}\\${file.path}\\${file.name}" already exists.`;
      console.log(msg);
      lg.emit("log", ".init.createFiles()", "INFO", msg);
    }
  });

  // end log messaging for createDirs txt files.
  let countMsg = "";
  if (txtCount === 0) {
    countMsg = "No text files in batch.";
  } else if (txtMkCount === 0) {
    countMsg = "All text files already exist.";
  } else if (txtCount === txtMkCount) {
    countMsg = `All text files (${txtMkCount} of ${txtCount}) created.`;
  } else {
    countMsg = `${txtMkCount} of ${txtCount} text files created.`;
  }
  console.log(countMsg);
  lg.emit("log", "initialize.createFiles()", "INFO", countMsg);

  // end log messaging for createDirs json files.
  if (jsonCount === 0) {
    countMsg = "No JSON files in batch.";
  } else if (jsonMkCount === 0) {
    countMsg = "All JSON files already exist.";
  } else if (jsonCount === jsonMkCount) {
    countMsg = `All JSON files (${jsonMkCount} of ${jsonCount}) created.`;
  } else {
    countMsg = `${jsonMkCount} of ${jsonCount} JSON files created.`;
  }
  console.log(countMsg);
  lg.emit("log", "initialize.createFiles()", "INFO", countMsg);
}

module.exports = {
  initializeApp,
};
