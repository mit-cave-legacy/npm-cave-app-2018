# MIT-CAVE monorepo
CAVE Open Source Application Development Repo

## Requirements
Requirements:
- `node@10.16.0` or higher
- `npm@6.9.0` or higher

## Instalation for general use
1) Globally install `create-cave-app`:
  ```bash
  npm install -g create-cave-app
  ```
2) Create a new application:
  ```bash
  cd /path/to/project/folder
  create-cave-app new myapp
  ```
  - This creates a `base` `cave-app` framework for development purposes. Extensions for the `base` framework are in development.

3) Check out the documentation for getting your application operational:
  - [base](https://github.com/mit-cave-open/cave-app/tree/master/examples/base)



## Installation for source code development

From a freshly-cloned repo in the project root:
```bash
npm ci
npm run bootstrap
npm run prep-link
cd ~/path/to/projects
create-cave-app new myprojectname
```

## Packages
- [`create-cave-app`](https://github.com/mit-cave-open/cave-app/tree/master/packages/create-cave-app)
- [`@mit-cave/core`](https://github.com/mit-cave-open/cave-app/tree/master/packages/core)
- [`@mit-cave/data`](https://github.com/mit-cave-open/cave-app/tree/master/packages/data)
- [`@mit-cave/map`](https://github.com/mit-cave-open/cave-app/tree/master/packages/map)
- [`@mit-cave/model`](https://github.com/mit-cave-open/cave-app/tree/master/packages/model)
- [`@mit-cave/pads`](https://github.com/mit-cave-open/cave-app/tree/master/packages/pads)
- [`@mit-cave/route`](https://github.com/mit-cave-open/cave-app/tree/master/packages/route)
- [`@mit-cave/scenario`](https://github.com/mit-cave-open/cave-app/tree/master/packages/scenario)
- [`@mit-cave/session`](https://github.com/mit-cave-open/cave-app/tree/master/packages/session)
- [`@mit-cave/ui`](https://github.com/mit-cave-open/cave-app/tree/master/packages/ui)
- [`@mit-cave/util`](https://github.com/mit-cave-open/cave-app/tree/master/packages/util)

## Examples
- [`base`](https://github.com/mit-cave-open/cave-app/tree/master/examples/base)
