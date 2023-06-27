/*
file: config.js

Commands:
myapp config --help                     displays help for the config command
myapp config --show                     displays a list of the current config settings
myapp config --reset                    resets the config file with default settings
myapp config --set <option> <value>     sets a specific config settings

date: 2023/06/20

*/

const Logger = require("./logger");

const lg = new Logger();
lg.listen();

// common core modules
const fs = require("fs");

const { configJson } = require("./templates");

const myArgs = process.argv.slice(2);

function displayConfig() {
  if (DEBUG) console.log("configApp()");
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error;
    console.log(JSON.parse(data));
  });
  lg.emit("log", "config.displayConfig()", "INFO", "config.json displayed");
}

function resetConfig() {
  if (DEBUG) console.log("config.resetConfig()");
  let configdata = JSON.stringify(configData, null, 2);
  fs.writeFile(__dirname + "/json/config.json", configdata, (error) => {
    if (error) throw error;
    if (DEBUG) console.log("Config file reverted to original state");
    lg.emit(
      "log",
      "config.resetConfig()",
      "INFO",
      "config.json reverted to original state."
    );
  });
}

function setConfig() {
  if (DEBUG) console.log("config.setConfig()");
  if (DEBUG) console.log(myArgs);
  let match = false;
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error;
    if (DEBUG) console.log(JSON.parse(data));
    let cfg = JSON.parse(data);
    for (let key of Object.keys(cfg)) {
      if (key === myArgs[2]) {
        cfg[key] = myArgs[3];
        match = true;
      }
    }
    if (!match) {
      console.log(`Invalid key: ${myArgs[2]}, try again.`);
      lg.emit(
        "log",
        "config.setConfig()",
        "WARNING",
        `invalid key: ${myArgs[2]}`
      );
    }
    if (DEBUG) console.log(cfg);
    data = JSON.stringify(cfg, null, 2);
    fs.writeFile(__dirname + "/json/config.json", data, (error) => {
      if (error) throw error;
      if (DEBUG) console.log("Config file has been updated.");
      lg.emit(
        "log",
        "config.setConfig()",
        "INFO",
        `config.json "${myArgs[2]}": updated to "${myArgs[3]}"`
      );
    });
  });
}

function configApp() {
  if (DEBUG) console.log("-configApp() running...");
  lg.emit("log", "configApp()", "INFO", "config option was called");

  switch (myArgs[1]) {
    case "--show":
      displayConfig();
      break;
    case "--reset":
      resetConfig();
      break;
    case "--set":
      if (myArgs.length < 4) {
        console.log(
          "Error: invalid syntax. Please type node myapp config --set [attribute] [new value]"
        );
        lg.emit("log", "config.configApp() --set", "WARNING", "invalid syntax");
      } else {
        setConfig();
      }
      break;
    case "--help":
    case "--h":
    default:
      try {
        if (!fs.existsSync(`${__dirname}/views/config.txt`))
          throw new Error(`${__dirname}\\views\\config.txt doesn't exist.`);
        fs.readFile(`${__dirname}/views/config.txt`, (error, data) => {
          console.log(data.toString());
        });
      } catch (error) {
        let msg = `There was a problem loading help files: ${error}`;
        console.error(msg);
        lg.emit("log", ".myapp()", "ERROR", msg);
        console.log("Recomend run: node myapp init --all");
      }
    // fs.readFile(`${__dirname}/views/config.txt`, (error, data) => {
    //   if (error) throw error; // polish this up perhaps. try/catch block.
    //   console.log(data.toString());
    // });
  }
}

module.exports = {
  configApp,
};
