# todo-md

A tool for the [TODO.md](https://github.com/todo-md/todo-md) standard

```shell
npx todo-md lint
Linting TODO.md

[warn] Found todos in file!

Section
[warn] - [ ] This task is open @owner
[warn]   - [ ] And it has a subtask!
BACKLOG
[warn] - [ ] This task is postponed
```

## Usage

- `npx todo-md lint` - lints `TODO.md`
- `npx todo-md help` - help 
- `npx todo-md help lint` - help on linting
- `npx todo-md lint -f README.md` - find open tasks in `README.md` instead
- `npx todo-md init` - create an example `TODO.md`


## Development

- `node index.mjs lint` - lint the `TODO.md`
- `node index.mjs init` - create an example `TODO.md`