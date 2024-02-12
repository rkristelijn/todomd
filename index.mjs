#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs";
import * as readline from "readline";

class Response {
  begin() {
    console.log("Begin");
  }
  end() {
    console.log("End");
  }
  debug() {
    console.log(this.constructor.name);
  }
}
class ConsoleResponse extends Response {
  begin(file) {
    console.log(`Linting ${file}`);
    console.log();
  }
  errorBegin() {
    console.log(warn + "Found todos in file!");
    console.log();
  }
  end() {
    console.log(success + "Linting complete");
  }
  header(section) {
    console.log(header(section));
  }
  headerEnd(_section) {
    return;
  }
  warn(message, _message2) {
    console.log(warn + message);
  }
  success() {
    console.log(success + "No todos found in file");
  }
}

class GitlabReportResponse extends Response {
  begin(_file) {
    console.log(
      '<testsuites name="tasks test" tests="0" failures="0" errors="0" time="0">'
    );
  }
  end() {
    console.log("</testsuites>");
  }
  errorBegin() {
    return;
  }
  header(section) {
    console.log(
      `  <testsuite name="${section}" errors="0" failures="0" skipped="0">`
    );
  }
  headerEnd(section) {
    console.log(`  </testsuite><!-- ${section} -->`);
  }
  warn(message, message2) {
    console.log(
      `    <testcase classname="${message2}" name="${message}" time="0" />`
    );
  }
  success() {
    return;
  }
}

const program = new Command();
const error = chalk.red("[error] ");
const warn = chalk.yellowBright("[warn] ");
const header = chalk.blueBright;
const success = chalk.greenBright("[success] ");

program
  .name("todomd")
  .description("A simple tool for working with TODO.md files")
  .usage(
    "lint\t\t - lints TODO.md\n  todomd lint -f README.md\t - lints README.md"
  )
  .version(process.env.npm_package_version);

program
  .command("lint")
  .description("Lint a TODO.md file")
  .option(
    "-f, --filename",
    "Location of markdown file to lint, defaults to TODO.md"
  )
  .option("-g, --gitlab", "Create a gitlab report response")
  .parse()
  .action((_str, options) => {
    const todoFile = options.args[0] || "TODO.md";
    const gitlabFile = options.args[1];
    lint(todoFile, gitlabFile);
  });

program
  .command("init")
  .description("Create a new TODO.md file")

  .action(() => {
    console.log("Creating a new TODO.md file");
    init();
  });

const lint = async (file, gitlab) => {
  let response;
  if (gitlab) {
    response = new GitlabReportResponse();
  } else {
    response = new ConsoleResponse();
  }

  response.begin(file);

  let currentSection = "";
  let previousSection = "";
  let printedHeader = false;
  let found = false;
  let shouldPrintHeaderEnd = false;
  const fileStream = fs.createReadStream(file);

  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of lines) {
    // Headers are # so they need to be isolated and only printed once
    if (line.startsWith("#")) {
      const header = line.match(/^#{1,3} (.*)/);
      previousSection = currentSection;
      currentSection = header[1];
      printedHeader = false;
    }

    // match the line to see if it is a todo item
    const match = line.match(/\s*- \[ \] (.*)/);
    if (match) {
      if (!found) {
        response.errorBegin();
        found = true;
      }

      if (!printedHeader) {
        if (shouldPrintHeaderEnd) {
          response.headerEnd(previousSection);
        }
        
        response.header(currentSection);
        // make sure to print only once
        printedHeader = true;
        // make sure to close the header if in xml
        shouldPrintHeaderEnd = true;
      }

      // print the actual warning
      response.warn(match[0], match[1]);
    }
  }
  if (!found) {
    response.success();
  }

  // don't forget to close if it was the last one
  if (shouldPrintHeaderEnd) {
    response.headerEnd(currentSection);
  }

  response.end();
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

program.parse(process.argv);
