const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const portfinder = require("portfinder");
const { DEFAULT_PORT, CONFIG_FILE_NAME } = require("../config");

const CWD = process.cwd();

async function getAvailablePort(reqPort) {
  const baseport = reqPort ? parseInt(reqPort, 10) : DEFAULT_PORT;
  const port = await portfinder.getPortPromise({ port: baseport });

  return port;
}

/**
 * Parse the `justdocs` folder to check if everything is correct.
 * @param {Array} directory An array of files return by the `fs.promises.readdir` function.
 */
function parseDirectory(directory) {
  let hasjustdocs = false;

  directory.forEach(file => {
    const fileExtension = path.extname(file.name);

    if (file.isDirectory()) {
      // justdocs doesn't contains folder, check if true.
      console.error(
        chalk`{red justdocs folder should only contain files, you've created ${chalk.bgRed.black(
          file.name
        )} folder}`
      );
      process.exit();
    }

    if (path.extname(file.name) === ".json") {
      // just docs can only have one justdocs.json
      if (hasjustdocs) {
        console.error(chalk`{red You can only have one json file}`);
        process.exit();
      }

      if (path.basename(file.name) !== CONFIG_FILE_NAME) {
        console.error(
          chalk`{red justdocs folder should have a ${chalk.bgRed.black(
            CONFIG_FILE_NAME
          )} file.}`
        );
        process.exit();
      }

      hasjustdocs = true;
    }

    if (![".md", ".json"].includes(fileExtension)) {
      // justdocs only contains .md and .json files.
      console.error(
        chalk`{red justdocs folder should only contain files with the .md extension, you've created ${chalk.bgRed.black(
          file.name
        )}}`
      );
      process.exit();
    }
  });
}

/**
 * Create the default config when user launch justdocs for the first time.
 */
function createDefaultConfig () {
  console.log(chalk`{blue Start creating just-docs project..}`);
  fs.promises.mkdir(path.resolve(`${CWD}/justdocs`));
};

module.exports = cliOptions => {
  console.log(cliOptions);
  fs.promises // check if justdocs folder exist.
    .access(path.resolve(`${CWD}/justdocs`))
    .catch(() => createDefaultConfig())
    .then(() => fs.promises.readdir(`${CWD}/justdocs`, { withFileTypes: true }))
    .then(directory => parseDirectory(directory))
    .finally(() => {
      console.log(chalk`{blue Starting the development server...}`);
      getAvailablePort();
      // TODO: Create the webpack config here.
    });

  ["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
      // TODO: Close the webpack-dev-server.
      console.log(chalk`\n{yellow Just-docs is closed see you 👋👋}`);
      process.exit();
    });
  });
};
