# cave-app

Template for jump starting CAVE applications.

## Features
  * Scenario management
    * Content/schema agnostic -- scenarios can be anything, and are stored in a document DB
  * Running of model calcs off of scenarios
  * Data management
    * background data
    * scenarios (model inputs), including complete log of all changes
    * model outputs (multiple runs)
    * place to put everything
  * Real-time synchronization of selection/data state across multiple maps, dashboards, control panels
  * Client routing
  * Integrates components from `@mit-cave/ui` to do the following:
  * Map
  * Dashboard
    * Charts


### Installation
You can install all dependencies for the `client` and `server` by running `npm run install-all` from the root of the project.
```
npm run install-all
```
- Notes:
  - you may need to `chown` and `chmod` your project folder to be able to execute from inside these files.
  - For git purposes, you may want to set filemode to `false` in your git project settings.

#### Populate default scenario data
You can populate a default scenario at any time from the `server` folder or the root of the project with:
```
npm run populate
```
This generates and outputs scenarios to `server/data/scenarios` that the server will present to the client on start.

#### Mapbox API token
Created CAVE apps require a Mapbox API token. We recommend obtaining a token and setting the `MapboxAccessToken` environment variable via `server/.env` as follows:
```
MapboxAccessToken=<your token here>
```

## Run in development

From the project root:
```
npm run dev
```

- Starts `server` with HTTP and socket server on `localhost:4000`
- Compiles `client`, available in the browser at `localhost:4000`

- Notes:
  - There are known issues with filewatchers in Atom when running this command in Ubuntu.
    - You may need to close Atom while starting the app. Once app is started, Atom can be opened again and hotloading should be functional.
    - You can also allow more filewatchers using:
    ```
    sudo sysctl fs.inotify.max_user_watches=32768
    ```
  - On Unix, if the last instance of the app was not shutdown correctly, an `EADDRINUSE` for the port can occur.
    - In linux, you can kill a port (EG:4000) with `fuser -k 4000/tcp`

Your app should be available at: `localhost:4000`

## Run in production
Production client builds run significantly faster in the browser than development ones.


### Option 1: Docker
```
docker build . -t my-cave-app
docker run -d my-cave-app -p 4000:4000
open http://$DOCKER_MACHINE_IP:4000
```

### Option 2: Build and run
To build an optimized bundle for production:

```
cd client && npm run build
```

The build should take approximately 1-2 minutes depending on the size of your project and your computer's hardware.
Once it's done, you should have highly-optimized Javascript, CSS, and other static assets in `client/dist`.

Make sure you copy the contents of `client/dist`  into `server/public`.


To build the server:
```
cd server && npm run build
```

By default the server will answer all HTTP requests with the `index.html` file in its `public` directory.

You can now run the server and the client in production mode:
```
cd server && npm start
open http://localhost:4000
```

## Getting Started
To get started using your newly build cave app, check out the [getting started guide](https://github.com/mit-cave-open/cave-app/tree/master/examples/base/docs/getting-started.md).
