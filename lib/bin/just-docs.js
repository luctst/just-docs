#!/usr/bin/env node
const chalk = require("chalk");
const meow = require("meow");
const versionRequired = require("../../package.json").engines.node;
const start = require("../command/start");

// Define cli commands and options.
const cli = meow(
  chalk`
    {blue Usage}
        $ just-docs <command> [options]

    {cyan Command}
        start
        build

    {yellow Options}
        --help, Display all commands and options availables.
        --version, Display the actual package version.

        start -p, --port <port> Use a specified port (default:3000)
        start -h, --hot-only Do not fallback to page refresh if hot reload fails (default: false)

        build
`,
  {
    flags: {
      port: {
        type: "number",
        alias: "p",
        default: 3000
      },
      "hot-only": {
        type: "boolean",
        alias: "h",
        default: false
      }
    }
  }
);

/**
 * Check if `nodeVersion` is above or equal to `requiredVersion`, if not stop the node process.
 * @param {String} nodeVersion The user NodeJs version.
 * @param {String} requiredVersion The version required to use this package.
 */
function checkVersion(nodeVersion, requiredVersion) {
  let showMsgError = false;
  let firstNumberRequiredVersion = "";
  const firstNumberNodeProcessVersion = parseInt(nodeVersion.split(".")[0], 10);

  if (!parseInt(requiredVersion[0], 10)) {
    // If first index of requiredVersion is not a number parse the string
    for (let index = 0; index <= requiredVersion.length; index += 1) {
      if (requiredVersion[index] === ".") break;
      if (!Number.isNaN(requiredVersion[index]))
        firstNumberRequiredVersion += requiredVersion[index];
    }
    if (firstNumberNodeProcessVersion < firstNumberRequiredVersion) showMsgError = true;
  }

  if (parseInt(requiredVersion[0], 10)) {
    firstNumberRequiredVersion = parseInt(requiredVersion.split(".")[0], 10);
    if (firstNumberNodeProcessVersion < firstNumberRequiredVersion) showMsgError = true;
  }

  if (showMsgError) {
    console.error(
      chalk.red(`\nMinimum node version not met :)`) +
        chalk.yellow(
          `\nYou are using Node ${process.version}, Requirement: Node ${requiredVersion}.\n`
        )
    );
    process.exit(1);
  }
}

/**
 * Check if the `commandEnter` is available.
 * @param {String} commandEnter The command enter by the user.
 */
function commandAvailable(commandEnter) {
  return ["start", "build"].includes(commandEnter);
}

checkVersion(process.versions.node, versionRequired); // First check if version is good.

if (cli.input.length === 0) {
  console.error(chalk`{red You must enter a command try this command below.}`);
  console.error(cli.showHelp(1));
}

if (cli.input.length >= 2) {
  console.error(
    chalk`{red You've enter more than one command, please enter only one command}`
  );
  console.error(cli.showHelp(1));
}

if (!commandAvailable(cli.input[0])) {
  console.error(
    chalk`{red Unknown command ${chalk.yellow(
      cli.input[0]
    )}, please enter a valid command}`
  );
  console.error(cli.showHelp(1));
}

switch (cli.input[0]) {
  case "start":
    start(cli.flags);
    break;
  case "build":
    break;
  default:
    break;
}
