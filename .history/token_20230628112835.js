/*

filename: token.js

Commands:

*************************************************************************************************************
myapp token <option>
-------------------------

myapp token --help                      displays help for the token command
myapp token --count                     displays a count of the tokens created
myapp token --new <username>            generates a token for a given username, saves tokens to the json file
myapp token --upd p <username> <phone>  updates the json entry for a given username with a new phone number
myapp token --upd e <username> <email>  updates the json entry for a given username with a new email
myapp token --search u <username>       fetches a token for a given username
myapp token --search e <email>          fetches a token for a given email
myapp token --search p <phone>          fetches a token for a given phone number

*************************************************************************************************************

First update: Glen Sturge 6/23/2023
*/
// const templates = require(".templates.js");

const fs = require("fs");
const path = require("path");
const crc32 = require("crc/crc32");
const { format } = require("date-fns");

const Logger = require("./logger");
const { error } = require("console");

const lg = new Logger();
lg.listen();

const myArgs = process.argv.slice(2);
const myArg = myArgs[1];

function tokenApp() {
  if (DEBUG) console.log("-tokenApp() running...");
  switch (myArg) {
    case "--count":
    case "--c":
      tokenCount();
      break;
    case "--new":
    case "--n":
      // if not long enough do a message ( < 3 length)
      if (myArgs < 3) {
        console.log("Invalid syntax! Use: node myapp token --new <username>");
      } else {
        // otherwise generate the new token.
        newToken(myArgs[2]);
      }
      break;
    case "--upd":
    case "--up":
      if (myArgs.length < 5) {
        console.log(
          "Invalid syntax... node myapp token --upd [option] [username] [new value]"
        );
        lg.emit(
          "log",
          "token.updateToken() --upd",
          "WARNING",
          "invalid syntax"
        );
      } else {
        updateToken(myArgs);
      }
      break;
    case "--search":
    case "--s":
      tokenSearch(myArgs);
      break;
    case "--help":
    case "--h":
    default:
      try {
        if (!fs.existsSync(`${__dirname}/views/token.txt`))
          throw new Error(`${__dirname}\\views\\token.txt doesn't exist.`);
        fs.readFile(`${__dirname}/views/token.txt`, (error, data) => {
          console.log(data.toString());
        });
      } catch (error) {
        let msg = `There was a problem loading help files: ${error}`;
        console.error(msg);
        lg.emit("log", ".myapp()", "ERROR", msg);
        console.log("Recomend run: node myapp init --all");
      }
    //   fs.readFile(`${__dirname}/views/token.txt`, (error, data) => {
    //     if (error) throw error;
    //     console.log(data.toString());
    //   });
    //   lg.emit("log", "token.tokenApp()", "INFO", "token help file accessed");
  }

  function tokenCount() {
    if (DEBUG) console.log("token.tokenCount()");
    try {
      let tokenList = JSON.parse(fs.readFileSync("./json/token.json"));
      let count = tokenList.length;
      console.log(`The token count is: ${count}`);
      return count;
    } catch (error) {
      let msg = `A problem was encountered with tokenCount(): ${error}`;
      console.log(msg);
      lg.emit("log", "token.tokenCount()", "ERROR", msg);
    }
  }

  function newToken(username) {
    if (DEBUG) console.log("token.newToken()");
    try {
      let tokenList = JSON.parse(fs.readFileSync("./json/token.json"));
      const newToken = { ...tokenList[0] };
      //   console.log(newToken);

      let now = new Date();
      let expiry = new Date(now);
      expiry.setDate(expiry.getDate() + 3);

      newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
      newToken.username = username;
      newToken.token = crc32(username).toString(16);
      newToken.expires = `${format(expiry, "yyyy-MM-dd HH:mm:ss")}`;

      tokenList.push(newToken);
      userTokens = JSON.stringify(tokenList, null, 2);

      fs.writeFileSync(`${__dirname}/json/token.json`, userTokens);

      let msg = `New token ${newToken.token} was created for ${username}`;
      console.log(msg);
      lg.emit("log", "token.newToken()", "INFO", msg);
      return { token: newToken.token, expires: newToken.expires };
    } catch (error) {
      let errorMsg = `Problem encountered generating new token: ${error}`;
      console.log(errorMsg);
      lg.emit("log", "tokenApp.newToken()", "ERROR", errorMsg);
    }
  }
}

function updateToken(argv) {
  if (DEBUG) console.log("token.updateToken()");
  if (DEBUG) console.log(argv);
  try {
    let tokens = JSON.parse(fs.readFileSync("./json/token.json"));
    tokens.forEach((obj) => {
      if (obj.username === argv[3]) {
        switch (argv[2]) {
          case "p":
          case "P":
            obj.phone = argv[4];
            break;
          case "e":
          case "E":
            obj.email = argv[4];
            break;
          default:
            throw error;
        }
      }
    });
    userTokens = JSON.stringify(tokens);
    fs.writeFile(__dirname + "/json/token.json", userTokens, (err) => {
      if (err) console.log(err);
      else {
        console.log(`Token record for ${argv[3]} was updated with ${argv[4]}.`);
        lg.emit(
          "log",
          "token.updateToken()",
          "INFO",
          `Token record for ${argv[3]} was updated with ${argv[4]}.`
        );
      }
    });
  } catch (error) {
    let errorMsg = `Problem encountered while updating token: ${error}`;
    console.log(errorMsg);
    lg.emit("log", "tokenApp.updateToken()", "ERROR", errorMsg);
  }
}

function tokenSearch(argv) {
  try {
    let tokens = JSON.parse(fs.readFileSync("./json/token.json"));

    switch (argv[2]) {
      case "u":
      case "U":
        tokens.forEach((obj) => {
          if (obj.username == argv[3]) {
            found = true;
            console.log(`${obj.username} : ${obj.token}`);
            return obj.token;
          }
        });
        if (!found) throw new Error("username not found.");
        break;
      case "e":
      case "E":
        tokens.forEach((obj) => {
          if (obj.email == argv[3]) {
            found = true;
            console.log(`${obj.username} : ${obj.token}`);
            return obj.token;
          }
        });
        if (!found) throw new Error("Email not found.");
        break;
      case "p":
      case "P":
        tokens.forEach((obj) => {
          if (obj.phone == argv[3]) {
            found = true;
            console.log(`${obj.username} : ${obj.token}`);
            return obj.token;
          }
        });
        if (!found) throw new Error("Phone number not found.");
        break;
      default:
        throw new Error(
          "Invalid syntax.  Please type node myapp --search [attribute] [search value]"
        );
    }
  } catch (error) {
    let errorMsg = `Problem encountered while searching for token:  ${error}`;
    console.log(errorMsg);
    lg.emit("log", "tokenApp.tokenSearch()", "ERROR", errorMsg);
  }
}

// function addDays(date, days) {
//   var result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }

module.exports = {
  tokenApp,
};
