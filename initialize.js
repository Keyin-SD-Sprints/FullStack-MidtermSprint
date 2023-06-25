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
// const fsP = require("fs").promises;

const { files, dirs } = require("./templates.js");

const lg = new Logger();
lg.listen();

const myArgs = process.argv.slice(2);
const myArg = myArgs[1];

async function initializeApp() {
  if (DEBUG) console.log("-initializeApp() running...");
  //   lg.emit("log", "initializeApp()", "INFO", "initialize app **test log.");
  switch (myArg) {
    case "--all":
    case "--a":
      if (DEBUG) console.log(myArg, "-creating files and folders");
      const { mkCount, made } = await createDirs();
      await createDirsMsg(mkCount, made);
      await createFiles();
      break;
    case "--mk":
    case "--m":
      if (DEBUG) console.log(myArg, "-creating all folders");
      createDirs();
      break;
    case "--cat":
    case "--c":
      if (DEBUG)
        console.log(myArg, "-creating default config files and the help files");
      createFiles();
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(`${__dirname}/initialize.txt`, (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
  }
}

async function createDirs() {
  if (DEBUG) console.log("init.createDirs()");
  let mkCount = 0;
  let made = [];
  dirs.forEach((dir) => {
    if (!fs.existsSync(path.join(__dirname, dir))) {
      try {
        fs.mkdirSync(path.join(__dirname, dir));
        let successMsg = `Directory '${__dirname}/${dir}' was created successfully.`;
        console.log(successMsg);
        lg.emit("log", "initialize.createDirs()", "INFO", successMsg);
        mkCount++; // Increment mkCount when directory is created
        made.push(dir);
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
  if (DEBUG) console.log("init.createFiles()");
  let jsonCount = 0;
  let txtCount = 0;
  let jsonMkCount = 0;
  let txtMkCount = 0;
  files.forEach((file) => {
    data =
      file.path === "json" ? JSON.stringify(file.data, null, 2) : file.data;
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
        if (file.path === "json") {
          jsonMkCount++;
        } else {
          txtMkCount++;
        }
      } catch (error) {
        let msg = `Encountered an error writing file "${__dirname}\\${file.path}\\${file.name}": ${error}`;
        console.error(msg);
        lg.emit("log", "init.createFiles()", "ERROR", msg);
      }
    } else {
      let msg = `"${__dirname}\\${file.path}\\${file.name}" already exists.`;
      console.log(msg);
      lg.emit("log", ".init.createFiles()", "INFO", msg);
    }
  });

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
