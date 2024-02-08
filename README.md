# todo-md

A tool for the [TODO.md](https://github.com/todo-md/todo-md) standard

```shell
npx todomd lint
Linting TODO.md

[warn] Found todos in file!

Section
[warn] - [ ] This task is open @owner
[warn]   - [ ] And it has a subtask!
BACKLOG
[warn] - [ ] This task is postponed
```

## Usage

- `npx todomd lint` - lints `TODO.md`
- `npx todomd help` - help 
- `npx todomd help lint` - help on linting
- `npx todomd lint -f README.md` - find open tasks in `README.md` instead
- `npx todomd init` - create an example `TODO.md`


## Development

- `node index.mjs lint` - lint the `TODO.md`
- `node index.mjs init` - create an example `TODO.md`