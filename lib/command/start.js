const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const portfinder = require("portfinder");
const webpack = require("webpack");
const { DEFAULT_PORT } = require("../config");

const CWD = process.cwd();
const signals = ["SIGINT", "SIGTERM"];

async function getAvailablePort(reqPort) {
  const baseport = reqPort ? parseInt(reqPort, 10) : DEFAULT_PORT;
  const port = await portfinder.getPortPromise({ port: baseport });

  return port;
}

module.exports = cliOptions => {
  const startCommand = fs.promises // check if justdocs folder exist.
    .access(path.resolve(`${CWD}/justdocs`))
    .then(() => {
      // TODO: Check if 0.md file exist.
    })
    .catch(() => {
      console.log(chalk`{blue Start creating just-docs project..}`);
      fs.promises.mkdir(path.resolve(`${CWD}/justdocs`));
      // TODO: At this point we should generate an default justdocs app because this is the first time user launch the package.
    });

  Promise.race([startCommand]).then(async () => {
    console.log(chalk`{blue Starting the development server...}`);
    // TODO: Create the webpack config here.
  });

  signals.forEach(signal => {
    process.on(signal, () => {
      console.log(chalk`\n{yellow Just-docs is closed see you 👋👋}`);
      process.exit();
    });
  });
};
