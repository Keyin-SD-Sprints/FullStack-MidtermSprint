const usageFull = `
*************************************************************************************************************

myapp <command> <option>
------------------------

Usage:

myapp --help                            displays all help

myapp init --help                       displays help for the init command
myapp init --all                        creates the folder structure and the config and help files
node myapp --s                          starts the webserver
myapp init --mk                         creates the folder structure
myapp init --cat                        creates the config file with default settings and the help files

myapp config --help                     displays help for the config command
myapp config --show                     displays a list of the current config settings
myapp config --reset                    resets the config file with default settings
myapp config --set <option> <value>     sets a specific config settings

myapp token --help                      displays help for the token command
myapp token --count                     displays a count of the tokens created
myapp token --new <username>            generates a token for a given username, saves tokens to the json file
myapp token --upd p <username> <phone>  updates the json entry for a given username with a new phone number
myapp token --upd e <username> <phone>  updates the json entry for a given username with a new email
myapp token --search u <username>       fetches a token for a given username
myapp token --search e <email>          fetches a token for a given email
myapp token --search p <phone>          fetches a token for a given phone number

*************************************************************************************************************
`;

const initUsage = `
*************************************************************************************************************
myapp init <option>
-------------------

myapp init --help                       displays help for the init command
myapp init --all                        creates the folder structure and the config and help files
myapp init --mk                         creates the folder structure
myapp init --cat                        creates the config file with default settings and the help files

*************************************************************************************************************
`;

const configUsage = `
*************************************************************************************************************
myapp config <option>
-------------------------

myapp config --help                     displays help for the config command
myapp config --show                     displays a list of the current config settings
myapp config --reset                    resets the config file with default settings
myapp config --set <option> <value>     sets a specific config settings

*************************************************************************************************************
`;

const tokenUsage = `
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
`;

configData = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the MyApp.",
  main: "myapp.js",
  superuser: "adm1n",
  database: "exampledb",
};

tokenData = [
  {
    created: "1969-01-31 12:30:00",
    username: "username",
    email: "user@example.com",
    phone: "5556597890",
    token: "token",
    expires: "1969-02-03 12:30:00",
    confirmed: "tbd",
  },
];

const dirs = ["logs", "models", "views", "routes", "json"];

const files = [
  { name: "usage.txt", path: "views", data: usageFull },
  { name: "init.txt", path: "views", data: initUsage },
  { name: "config.txt", path: "views", data: configUsage },
  { name: "token.txt", path: "views", data: tokenUsage },
  { name: "token.json", path: "json", data: tokenData },
  { name: "config.json", path: "json", data: configData },
];

module.exports = {
  files,
  dirs,
};
