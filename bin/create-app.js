const util = require("util");
const fs = require("fs");

const exec = util.promisify(require("child_process").exec);

async function runCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error) => {
      console.log("\x1b[31m", error, "\x1b[0m");
    };
  }
}

async function main() {
  try {
    console.log("Downloading files...");
    await runCmd(`git clone https://github.com/ravithakur247/ts-onion.git`);
    console.log("Installing  dependencies...");
    await runCmd("npm install");
    fs.unlinkSync("./.git");

    console.log("The installation is done, this is ready to use !");
  } catch (error) {
    console.log(error);
  }
}
main();
