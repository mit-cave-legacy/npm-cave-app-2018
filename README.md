# This is a Legacy Project and has been replaced by a newer CAVE App.

The current CAVE CLI can be found [here](https://github.com/MIT-CAVE/cave_cli). It is used to create new cave projects and provide a variety of useful features.

For non CLI access, you can directly use the [current cave app](https://github.com/MIT-CAVE/cave_app) and follow the non cli directions [here](https://github.com/MIT-CAVE/cave_app/blob/main/NON_CLI_README.md).

## The Original Readme is Below
</br></br>
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
-   [base](https://github.com/mit-cave-open/cave-app/tree/master/templates/base)



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
