#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs";
import * as readline from "readline";

const program = new Command();
const error = chalk.red("[error] ");
const warn = chalk.yellowBright("[warn] ");
const header = chalk.blueBright;
const success = chalk.greenBright("[success] ");

program
  .name("todo-md")
  .description("A simple tool for working with TODO.md files")
  .usage(
    "lint\t\t - lints TODO.md\n  todo-md lint -f README.md\t - lints README.md"
  )
  .version(process.env.npm_package_version);

program
  .command("lint")
  .description("Lint a TODO.md file")
  .option(
    "-f, --fileName",
    "Location of markdown file to lint, defaults to TODO.md"
  )
  .action((_str, options) => {
    const todoFile = options.args[0] ?? "TODO.md";
    console.log(`Linting ${todoFile}`);
    console.log();
    lint(todoFile);
  });

program
  .command("init")
  .description("Create a new TODO.md file")
  .action(() => {
    console.log("Creating a new TODO.md file");
    init();
  });

const lint = async (file) => {
  let currentSection = "";
  let printedHeader = false;
  let found = false;
  const fileStream = fs.createReadStream(file);

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of lines) {
    // Headers are # so they need to be isolated and only printed once
    if (line.startsWith("#")) {
      const header = line.match(/^#{1,3} (.*)/);
      currentSection = header[1];
      printedHeader = false;
    }

    // match the line to see if it is a todo item
    const match = line.match(/\s*- \[ \] (.*)/);
    if (match) {
      if (!found) {
        console.log(warn + "Found todos in file!");
        console.log();
        found = true;
      }

      if (!printedHeader) {
        // make sure to print only once
        console.log(header(currentSection));
        printedHeader = true;
      }

      console.log(warn + match[0]);
    }
  }
  if (!found) {
    console.log(success + "No todos found in file");
  }
};

const init = () => {
  fs.writeFileSync(
    "TODO.md",
    `
# TODO

sample README.md from [todo-md](https://github.com/todo-md/todo-md)

This text is not a task.

## Section

And this text neither.

- [ ] This task is open @owner
  - [ ] And it has a subtask!

# BACKLOG

- [ ] This task is postponed

# DONE

- [x] This task is done #prio1
- [-] This task has been declined`
  );
};

program.parse();
