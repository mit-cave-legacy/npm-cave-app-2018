# Integrating a machine learning model

CAVE apps ship with built-in support for machine learning integration, allowing rapid feedback for the output of
different scenarios that can be fully and automatically realized into an application.

Ultimately CAVE apps make no assumptions about where or how your model is run. For this example, we'll simulate a model
by running a NodeJS command line program from the server in another process on the same machine the server is running
on.

Basic model run functionality is provided by the `@mit-cave/model` package, which includes the following events used by
both client and server;

```js
export const modelEvent = {
  RUN: 'model/run',
  CANCEL: 'model/cancel',
  RUN_STARTED: 'model/run-started',
  RUN_PROGRESS: 'model/run-progress',
  RUN_FINISHED: 'model/run-finished',
  RUN_FAILURE: 'model/run-failure',
  RUN_CANCELLED: 'model/run-cancelled',
  RUN_OUTPUT: 'model/run-output',
}
```

The server has handlers for `RUN` and `CANCEL` events in `server/src/events/modelEvents.js`. As the running process
progresses, fails, or completes, the server dispatches the appropriate events to clients that are subscribed to the
scenario associated with the model run.

The client by default has handlers for model events as part of `regModelFeature` in `client/src/features/index.js`. It
is not by default set up to dispatch any model-related events however, in part because it doesn't render any
model-specific componts that allow the user to interact with the model.

We can surface these components in the UI by uncommenting `RunModelOutput` in `client/src/views/map/ControlOverlay.js`

```js
export const ControlOverlay = component('ControlOverlay', () => (
  <div>
    <BottomCenter>
      <MapMenuBar />
    </BottomCenter>
    <BottomRight
      className={css({
        right: px(16)
      })}
    >
      <MapControls />
    </BottomRight>
    <MapLegend />
    <ScenarioLibrary />
    {/*<RunModelOutput />*/} // uncomment this line
    <EditManager />
  </div>
))
```
We'll also uncomment the `RunModelButton` component in `client/src/views/control/MapMenuBar.js`


```js
export const MapMenuBar = component(
  'MapMenuBar',
  createSub({
    getCurrentScenario,
    getOverallLayout
  }),
  ({ currentScenario, dispatch }) => (
    <MenuBar>
      <MenuBarButton
        icon={<IconLibrary />}
        title="Scenario"
        onClick={() => dispatch(padEvent.TOGGLE, 'scenarios')}
      >
        {R.propOr('-', 'name', currentScenario)}
      </MenuBarButton>
      <MenuBarButton
        icon={<IconOptions />}
        title="Edit Manager"
        onClick={() => {
          dispatch(padEvent.TOGGLE, 'editManager')
        }}
      >
        Manage edits
      </MenuBarButton>
      {/*<RunModelButton />*/} // uncomment this line
      <MenuBarButton
        icon={<IconKeypad />}
        title="Map Legend"
        onClick={() => {
          dispatch(padEvent.TOGGLE, 'mapLegend')
        }}
      >
        Toggle layers
      </MenuBarButton>
    </MenuBar>
  )
)
```

Since model runs are performed in the context of scenarios, ensure you've created and selected scenario for your app.
The easiest way is to click on the "scenario" menu at the bottom of the map page. At this point if you've uncommented
the `RunModelButton` above you should see a new button labeled "Model":

![image](https://user-images.githubusercontent.com/9045165/66093194-0ff8a100-e544-11e9-96a4-5e6e837412ff.png)

Clicking the model button will open a pad with a play icon in the bottom left corner. Click it to start the simulated
model run. 

![image](https://user-images.githubusercontent.com/9045165/66093624-e0e32f00-e545-11e9-8aa5-26ae28f7af1c.png)

By default, the server listens to stdout and stderr of the running process. In this case, we're simulating a model run
with another `node` process, but it can be any program that can be run from the command line. For a python program, for
example we could substitute the following in `server/src/events/modelEvents.js`

```js
 runningProcess = execa('node', [filePath, id])
```

with 

```js 
runningProcess = execa('python', [pathToScript, otherArgs])
```

Equally for an executable:

```
runningProcess = execa('./my-model', [modelArgs])
```

If a line of stdout or stderr contains a number and `%`, the server interprets this as a progress update and broadcasts
the model run's progress to all connected clients. This can be useful to inform users that the model is working toward a
solution and not stalled, which is especially helpful for longer-running processes.
