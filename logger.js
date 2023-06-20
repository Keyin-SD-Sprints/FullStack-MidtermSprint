const { format, getYear, getMonth } = require("date-fns");
const { v4: uuid } = require("uuid");

const EventEmitter = require("events");
const path = require("path");
const fs = require("fs");
const fsP = require("fs").promises;

class Logger extends EventEmitter {
  listen() {
    this.on("log", (event, level, msg) => this.#logEvents(event, level, msg));
  }

  //method is defined as a private method using the # syntax
  async #logEvents(event, level, msg) {
    // time stamp to be included on each line of the log.
    const timeStamp = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;

    // formatted line for the log.
    const logItem = `${timeStamp}\t${level}\t${event}\t${msg}\t${uuid()}\n`;
    // folder creation
    try {
      const currentYearDir = "logs/" + getYear(new Date());
      const currentMonthDir = currentYearDir + "/" + getMonth(new Date());
      // if 'logs/' doesn't exist, make it
      if (!fs.existsSync(path.join(__dirname, "logs/")))
        await fsP.mkdir(path.join(__dirname, "logs/"));
      // if subdir in 'logs/' for the current year doesn't exist, make it.
      if (!fs.existsSync(path.join(__dirname, currentYearDir)))
        await fsP.mkdir(path.join(__dirname, currentYearDir));
      // if subdir in 'logs/<currentYear>' for the current month doesn't exist, make it.
      if (!fs.existsSync(path.join(__dirname, currentMonthDir)))
        await fsP.mkdir(path.join(__dirname, currentMonthDir));
      // formated file name with date.
      const fileName = `${format(new Date(), "yyy-MM-dd")}` + "_events.log";
      // if file doesn't exist, will be created, otherwise logItem will be appended.
      await fsP.appendFile(
        path.join(__dirname, currentMonthDir, fileName),
        logItem
      );
    } catch (error) {
      console.log("Problem encountered logging event: " + error);
    }
  }
}

module.exports = Logger;
