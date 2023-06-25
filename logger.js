const { format, getYear, getMonth } = require("date-fns");
const { v4: uuid } = require("uuid");

const EventEmitter = require("events");
const path = require("path");
const fs = require("fs");
// const fsP = require("fs").promises;

class Logger extends EventEmitter {
  // private properties.
  #queue;
  #running;

  constructor() {
    super(); //need to run super() once you specify a constructor.
    this.#queue = []; //list to store incoming log events.
    this.#running = false; //boolean tracks if queue is processing.
  }

  // method to start listener.
  listen() {
    this.on("log", (event, level, msg) => this.#queuePush(event, level, msg));
  }

  //both of the following methods are defined as a private method using the '#' syntax.
  // there's no need for them to be accesible directly from outside. 'listen()' is the only accesible method.

  // added a queue to logger because other attempts at having the logs not be intermingled
  // and out of chronological order were not entirely succesful.
  // some of the other ideas could probably be reviewed to see if they are still necessary (in initialize I believe)
  // does seem to work satisfactorily right now regardless.
  async #queuePush(event, level, msg) {
    //add the log arg requirements as an object to the queue.
    this.#queue.push({ event, level, msg });

    // if the queue is not running, start it and wait for it.
    // if a second log gets added to the queue it will be next in line
    // and the queue 'then' is already running and will keep running until the list is exhausted.
    // hopefully spamable...
    if (!this.#running) {
      this.#running = true;
      await this.#processQueue();
    }
  }

  // method to chronologically process the log events as received.
  //
  // I went with the synchronous/blocking versions of the directory creation and file creation because
  // was sometimes getting an error that some or another folder didn't exist on the 'init --a' cycle
  // seems to me that when you are dropping a directory into a parent directory that you just created in the last line of code
  // it might be prudent to use the blocking version of the parent directory creation so that you wouldn't encounter that error.
  // whereas if you are dropping a bunch of independant directories without subdirs it would make sense performance wise to use the promised version.
  //
  async #processQueue() {
    // for as long as there is a queue...
    while (this.#queue.length > 0) {
      // .shift() removes first element of the list and returns it.
      // 2nd element becomes first and so on...
      // deconstruct the object. all these variables (event, level, & msg) are then accesible in code below.
      const { event, level, msg } = this.#queue.shift(); // fifo!
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
          fs.mkdirSync(path.join(__dirname, "logs/"));
        // if subdir in 'logs/' for the current year doesn't exist, make it.
        if (!fs.existsSync(path.join(__dirname, currentYearDir)))
          fs.mkdirSync(path.join(__dirname, currentYearDir));
        // if subdir in 'logs/<currentYear>' for the current month doesn't exist, make it.
        if (!fs.existsSync(path.join(__dirname, currentMonthDir)))
          fs.mkdirSync(path.join(__dirname, currentMonthDir));
        // formated file name with date.
        const fileName = `${format(new Date(), "yyyy-MM-dd")}` + "_events.log";
        // if file doesn't exist, will be created, otherwise logItem will be appended.
        fs.appendFileSync(
          path.join(__dirname, currentMonthDir, fileName),
          logItem
        );
      } catch (error) {
        console.log("Problem encountered logging event: " + error);
      }
    }
    //once the queue is exhausted, shut it down so when the next
    //log event happens, #processQueue will be activated again
    // in #queuePush.
    this.#running = false;
  }
}

module.exports = Logger;
