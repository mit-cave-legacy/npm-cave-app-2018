In this tutorial, we will cover many of the topics you need to get started using Cave-app through an in-depth example.

To do this, we will be adding a Scatterplot layer to the base map. You should have already gotten the app functional in development mode on your localhost:4000 port using the [README.md](../README.md).

We'll be visualizing [Walmart stores](https://gist.githubusercontent.com/anonymous/83803696b0e3430a52f1/raw/29f2b252981659dfa6ad51922c8155e66ac261b2/walmart.json), but any data with lat/long coordinates will work.

Here's an object in our sample dataset:
```json
{
  "id": 6601,
  "storeType": 3,
  "timeZone": "K",
  "openDate": "01/04/1994 12:00",
  "name": "Sam's Club",
  "postalCode": "99515",
  "address1": "8801 Old Seward Hwy",
  "city": "Anchorage",
  "state": "AK",
  "country": "US",
  "latitude": 61.14076995,
  "longitude": -149.86001586,
  "phone_number": "(907) 522-2333"
}
```

Our client app will take the lat long coordinates and render a dot for each one on the map.

We'll be working from a fresh `create-cave-app` default template and this file structure:
```
.
├── client
│   └── src
│       ├── mit-cave
│       │   ├── core
│       │   ├── data
│       │   ├── map
│       │   ├── model
│       │   ├── pads
│       │   ├── route
│       │   ├── scenario
│       │   ├── session
│       │   ├── ui
│       │   └── util
│       ├── common
│       ├── events
│       ├── features
│       ├── fonts
│       ├── resources
│       ├── subs
│       └── views
│           ├── control
│           ├── dashboard
│           └── map
└── server
    └── src
        ├── mit-cave
        ├── common
        └── events
```
_Note_: If you're starting from scratch, make sure you've run `npm run install-all` from the root project folder. You may also want to make sure you've run `git init` and committed

The client will render the map in the browser, and the server will fetch the data and send it the client.

## Loading data on the server

For this example we'll read the data from the local filesystem when the server starts, so let's put our json file in a new directory, `server/data`:
```bash
mkdir -p server/data && wget -O server/data/walmart.json https://gist.githubusercontent.com/anonymous/83803696b0e3430a52f1/raw/29f2b252981659dfa6ad51922c8155e66ac261b2/walmart.json
```

_Note_: Feel free to substitute this step with a REST request or database query. It doesn't matter how you get your data to the server. This is just part of the example.

In `server/src/events/serverEvents.js`, the `create-cave-app` template provides the following event handler:

```js
regEventFx(sevt.INITIALIZE_DB, () => ({
  db: {
    clients: {},
    subscriptions: {},
    sessions: {
      default: {
        id: 'default'
      }
    }
  }
}))
```

This runs whenever the `INITIALIZE_DB` event is dispatched. A "find usages" search should show this event is only dispatched when the server starts:
`server/src/index.js:7`
```js
dispatch(sevt.INITIALIZE_DB)
```

We could try to load the data in the `INITIALIZE_DB` handler. However, fetching data is a separate thing, and an important part of what our server does. Further, it's something that can fail. If we combined it with `INITIALIZE_DB`, it'd cause everything else in db initialization to fail along with it, and make it harder for us to figure out exactly what caused the failure.

With this in mind, we're going to model it as a new event. We'll call it `LOAD_DATA`, but you can use whatever name you like.

`server/src/serverEventTypes.js`
```js
export const sevt = {
  INITIALIZE_DB: 'initialize-server-db',
  LOAD_CURRENT_SCENARIO: 'load-current-scenario',
  SCENARIO_LOADED: 'scenario-loaded',
  LOAD_DATA: 'load-data'
}
```

Back in the `serverEvents.js` file, let's add  a handler for it. This defines what happens when the `LOAD_DATA` event occurs (i.e., is `dispatch`ed):

```js
import path from 'path'
import { readJson } from 'fs-extra'
import * as R from 'ramda'
// ...

regEventFx(sevt.LOAD_DATA, async () => {
  const stores = await readJson(
    path.resolve(__dirname + './../data/walmart.json')
  )

  return {
    db: R.assocPath(['data', 'stores'], stores)
  }
})
```

Now whenever we `dispatch(sevt.LOAD_DATA)`, this will read the data from the file and store it in `background.points`, where it will be available to the rest of our server.

Let's break this particular event down for explanation purposes:

- `regEventFx` is used to register the event handler. This allows it to be `dispatch`ed from anywhere.
  -  Note: `regEventFx` comes from `store.js` where we have integrated the `server-fx` package with our `serverEventTypes`.
  - The first parameter given is the server event we want to register or `sevt.LOAD_DATA`
  - The second parameter is a function to resolve.
    - In this case, we use an asynchronous arrow function to read our `walmart.json`
    - We then return a Ramda function to assocate the db object we will create where:
      ```
      {
        clients: {},
        subscriptions: {},
        sessions: {
          default: {
            id: 'default'
          }
        }
      }
      ```
      becomes:
      ```
      {
        clients: {},
        data: {
          stores: {
            < Walmart stores data here >
          }
        },
        subscriptions: {},
        sessions: {
          default: {
            id: 'default'
          }
        }
      }
      ```
      See the [Ramda docs](https://ramdajs.com/docs/) for more info on Ramda functions.


Since we want this to happen when the server starts, we dispatch it from `INITIALIZE_DB` in `server/src/events/serverEvents.js`:
```js
regEventFx(sevt.INITIALIZE_DB, () => ({
  db: {
    clients: {},
    subscriptions: {},
    sessions: {
      default: {
        id: 'default'
      }
    }
  },
  dispatch: [sevt.LOAD_DATA]
}))
```

## Sending data to the client
The client can receive data via the socket API or an HTTP request to the REST API.
When the dataset is sufficiently huge (e.g. 500,000 database rows) the REST API is a good choice because it provides better performance.
For most things, the socket API is plenty fast, more intuitive, and more powerful.
It can send updates without requiring the client to ask for them.
It uses the same event-driven API (`eventTypes`, `regEventFx`) that the apps use to perform their local functionality, and extends it to allow client and server to communicate over the socket as if they were one and the same.
The only difference is that events are `emit`ted from the server to the client (or vice versa) instead of `dispatch`ed.


We can use the default client connection event, `SOCKET_CONNECTED`,
to send data to the newly-connected client from the server whenever a client connects.
Note:
We could also turn this into a request via socket (whenever the client asks for the data
the server returns) or a subscription (whenever the data changes, the server sends the new data to the client).
The `@mit-cave/data` package provides this basic functionality, but we're going to show how
to implement it here.

Let's have the client ask the server for the stores.
This means the client and server will need to agree on a name for this event.
Event names are just strings, so we could write them in literally if we needed to.
We find using the same eventType objects on the client and server is best to avoid duplication
and provide make it easier to see where this particular event is being used using "find usages" in our IDE.

By default, the server template requires shared eventTypes from the client in `mit-cave/index.js`.
```js
export { dataEvent } from '../../../client/src/mit-cave/data/event'
export { scenarioEvent } from '../../../client/src/mit-cave/scenario/event'
export { sessionEvent } from '../../../client/src/mit-cave/session/event'
export { modelEvent } from '../../../client/src/mit-cave/model/event'
```


This works because no browser-specific code is imported -- the files just contain data.

Example:

`client/src/mit-cave/session/event.js`
```js
export const sessionEvent = {
  INITIAL_VARS: 'session/initial-vars',
  CHANGE_VAR: 'session/change-var',
  VAR_CHANGED: 'session/var-changed',
  SUBSCRIBE: 'session/subscribe',
  SUBSCRIBE_TO_LIST: 'session/subscribe-to-list',
  CREATE: 'session/create'
}
```

Feel free to add a new event to any of these, but be aware they're copied from a version of the published `@mit-cave/` package.
 This might make it more difficult to upgrade your version if you want to in the future.

Instead of modifying existing eventTypes, let's add our own.
We'll call them `appEvent` since they're specific to our app.

We'll make a new folder `client/src/app` and a file `eventTypes.js`:
```js
export const appEvent = {
  INITIAL_STORES_REQUEST: 'appEvent/initial-stores-request',
  INITIAL_STORES: 'appEvent/initial-stores'
}
```
Now the client can `emit` an `INITIAL_STORES_REQUEST` to the server.
When the server sees this, it can `emit` `INITIAL_STORES` to the client.

Note: This can be done without a request.
For example, you might want the server to send the data in response to the `SOCKET_CONNECTED` event.
The client will be set up to handle `INITIAL_STORES` no matter what, so everything will work
the same independent of the reason the event was sent. In this case things will work fine too if
the client sends `INITIAL_STORES_REQUEST` and the server ignores it (i.e. doesn't have a `regEventFx` for it).

Next we give the server access to these event types.

We'll mirror the same directory structure as the client, making a new
directory in `server/src/app` with a file named `eventTypes.js`

`server/src/app/eventTypes.js`
```js
export { appEvent }  from '../../../client/src/app/eventTypes'
```

Now the server can register an event handler using `regEventFx` for
`appEvent.INITIAL_STORES_REQUEST`.

Let's make a new file for our app-specific event handlers, `server/src/app/events.js`
and add the following:

```js
import * as R from 'ramda'
import { regEventFx } from '../store'
import { appEvent } from './eventTypes'


regEventFx(appEvent.INITIAL_STORES_REQUEST, ({ db }) => {
  return {
    emit: [appEvent.INITIAL_STORES, R.path(['data', 'stores'], db)]
  }
})
```
Great. Whenever an initial stores request, send the initial stores.

Let's write the handler for it on the client. We'll just save the stores into
the client's `db` at `data.stores`.

Note: This just happens to be the same path we used on the server.
There's no magic going on here, you can write them to whatever path you like.

`client/src/app/events.js`
```js
import * as R from 'ramda'
import { regEventFx } from '../store'
import { appEvent } from './eventTypes'


regEventFx(appEvent.INITIAL_STORES, (_, __, stores) => {
  return {
    db: R.assocPath(['data', 'stores'], stores)
  }
})
```

#### Registering client event handlers

In order for either of these handlers to work, they need to be "registered". This will happen automatically (calling `regEventFx` registers them) so long as
they run. Right now they are run by each respective `index.js` under the nomenclature `../app/events`. If you create a different file structure, you will need to import them because no part of our program actually requires (or `import`s) these files that were created.

Before going further, check to make sure this is importing correctly from `app` in both the client and server:

`client/src/events/index.js`
```js
import './diffEvents'
import './generalEvents'
import '../app/events'
```

`server/src/events/index.js`
```js
import './dataEvents'
import './sessionEvents'
import './scenarioEvents'
import './modelEvents'
import './serverEvents'
import '../app/events'
```

Note:
- If you use different names, this will need to be reflected in each respective `index` file

Now all we have to do is `emit` `REQUEST_INITIAL_STORES` from the client
and things should just work.

We know we want to do this once the socket is connected. `client/src/mit-cave/data` provides
the socket functionality for us and includes a `SOCKET_CONNECTED` event.

In `client/src/mit-cave/data/index.js`, we can see there's already an event handler registered for
`SOCKET_CONNECTED`:

```js
regEventFx(dataEvent.SOCKET_CONNECTED, ({ db }) => ({
    db: R.assoc('connected', true),
    emitN: [[dataEvent.SUBSCRIBE_TO_BACKGROUND_DATA]]
  }))
```

We could change this to emit our `INITIAL_STORE_REQUEST` when the socket connects,
along with the existing `dataEvent.SUBSCRIBE_TO_BACKGROUND_DATA`:
```js
regEventFx(dataEvent.SOCKET_CONNECTED, ({ db }) => ({
    db: R.assoc('connected', true),
    emitN: [
      [dataEvent.SUBSCRIBE_TO_BACKGROUND_DATA],
      [storeEvent.INITIAL_STORES_REQUEST]
    ]
  }))
```

In general, it is best to keep changes away from the `mit-cave` folder as these are core functions and can cause issues with integrating future updates into your app. Let's handle the same event in a more appropriate place.

Since we're still working with a specific client `appEvent`, let's add a handler in
`client/src/app/events.js`:

```js
...
import { dataEvent } from 'mit-cave/data'

...

regEventFx(dataEvent.SOCKET_CONNECTED, () => {
  return {
    emit: [appEvent.INITIAL_STORES_REQUEST]
  }
})
```

Note: We can do this because the order of events isn't important. If they needed to happen in order, we can always use `emitN` (like in the first example). This would guarantee the first event is dispatched before the second. In this case, we would still want to call emitN from `client/src/app/events.js`. We may need to remove the `emitN` event from the `client/src/mit-cave/data/index.js` if we need `SUBSCRIBE_TO_BACKGROUND_DATA` to be in a specific order. This may cause issues when pulling a new version of the app.

The client should now have the stores data.
- You can verify this by evaluating `window._store.getState()` from the browser console.
  - `_store` is specifically not related to our `stores` data, but the way that browsers process data.
- For the stores data, expand the object and check `data/stores` where you should see a list of Walmart store locations.

## Adding the scatterplot layer

Map layers are registered in `client/src/views/map/layers.js` as functions that receive the `db` and return a `deck.gl` `Layer`.

Note:
- We also support layer functions that return a layer description as a plain Javascript object
- This API is more data-driven and supports fully serializable layer descriptions,
making it a bit easier to persist them, send them via socket to other apps, etc.

Let's go ahead and register a name for our function that will take a `db` as an argument and return the scatterplot layer for the stores.
We're naming ours `getStoresLayer`, but you can name yours something better. We're just typing in the name of something that doesn't
exist yet, so our IDE is upset, but that's ok. We'll add it in a second.

`client/src/views/map/layers.js`
```js
export const MAP_LAYERS = {
  stores: getStoresLayer
}
```
We're going to make `getStoresLayer` a selector.

Note:
- A selector is a function that remembers the last input value it was called with and the return value that was generated from it.
- If a selector is called with the same input multiple times in a row, the corresponding value is returned without running the calculation again.
- This is useful in many settings, but it's especially useful for React apps, since it can help us tell `React` that it shouldn't render when our data hasn't changed, avoiding unnecessary virtual DOM reconciliation.


Let's make a new file for it in `client/src/app/layerSelectors.js`.

At this point we at least know we need something like this:
```js
import {ScatterplotLayer} from 'deck.gl'

export const getStoresLayer = db => {
  return new ScatterplotLayer()
}
```

For the scatterplot layer, we'll need to pass our data along with configuration for how it should be visualized to `deck.gl`'s
[`ScatterplotLayer`](https://deck.gl/#/documentation/deckgl-api-reference/layers/scatterplot-layer)

There are many configuration options. For our simple scatterplot, we'll focus on the following.
```js
new ScatterplotLayer({
    // An id or name for the layer. Should be unique across all layers.
    id,

    // A list of objects. Each item in the list will be called with the provided functions (e.g. `getPosition`, `getColor`)
    data,

    // A function that provides the color of the scatterplot point for the item `d` in the `data` array
    // should return the color in rgb format (`[255, 255, 255]`)
    getColor,

    // a function that provides the position as `[lon, lat]` for the item `d` in the `data` array
    // Note: You may be used to the order `[lat, lon]`. `[lon, lat]` is used in this case, which follows the `[x, y]` convention
    getPosition,

    // a function that provides the radius for the size of the point to be rendered for the item `d` in the `data` array
    getRadius,
  })
```

The `data` field can be whatever we want. We're going to use the stores raw from the server, unmodified.
Remember each has the following shape:
```json
{
  "id": 6601,
  "storeType": 3,
  "timeZone": "K",
  "openDate": "01/04/1994 12:00",
  "name": "Sam's Club",
  "postalCode": "99515",
  "address1": "8801 Old Seward Hwy",
  "city": "Anchorage",
  "state": "AK",
  "country": "US",
  "latitude": 61.14076995,
  "longitude": -149.86001586,
  "phone_number": "(907) 522-2333"
}
```

So we'll be passing in extra data, but that's ok. For sure, however, we need to change
our `latitude` and `longitude` to the format `ScatterplotLayer` expects.
One way is to define its `getPosition` function:
```js
export const getStoresLayer = db => {
  return new ScatterplotLayer({
  getPosition: d => [d.longitude, d.longitude],
  })
}
```

That should work. Let's fill in a few more. Our full code in `client/src/app/layerSelectors.js` should now look like:
```js
import {ScatterplotLayer} from 'deck.gl'

export const getStoresLayer = db => {
  return new ScatterplotLayer({
    id: 'stores',
    getPosition: d => [d.longitude, d.longitude],
    getRadius: d => 100, // ignore the store's data, not making radius a function of it for now
    getColor: d => [255, 0, 0] // ignore the store's data -- all points are red, for now
  })
}
```

#### Getting data
Now all we need is our data.

We could write `data: db.data.stores`; after all, that's where the stores data lives.
However, we strongly encourage writing reusable selector functions for this purpose instead.

Note:
- A selector is little more than a reusable function that operates over some part of the `db` and returns data that will ultimately be rendered by `deck.gl` or `React`.


Selectors typically fall into two categories:
- Base selectors read from the `db` directly. They perform return minimal transformations, if any. Often, they're just doing the equivalent of `db.foo.bar`. That's ok! There are two main reasons to use them, one related to computer performance, the other to developer performance.
    1. Defining even the simplest of getters as function and using them in a selector chain means they will be memoized, ensuring
    any computation they perform will be run at most one time per `db` state change.
    2. We can easily change how a function like `getStores` works. We might later want to get the stores from `db.walmart.stores`.
    As long as it returns the same thing it did before, all computations derived from it are guaranteed to work.

- The other category of selectors are "derived". They chain off of and depend upon the return value of other selector functions.
By this we mean their inputs are base selectors, other derived selectors, or a combination of both.

  - The `derive` function lets us define a new selector with explicit inputs. It's generally not possible or desired to use `derive` with the whole `db` state.
  - Instead, we exclude everything that's irrelevant to the function we're defining and only work with the data we care about.

We'll show more complex examples of derive in the "toggling layer visibility section".

For now, it's helpful to know just the basic syntax. Here's a (very) contrived example:
```js
// get all stores (as they are in the `db`)
export const getStores = R.pathOr([], ['data', 'stores'])

export const getWalmartStores = derive(
  // from stores,
  [getStores],
  // take them
  stores =>
  // and mark them as walmart stores (contrived example,  not real data)
  // remember this doesn't modify the stores in the `db`,
  // we always a new value (all ramda operations are immutable)
  R.map(store => R.assoc('merchant','walmart', store), stores)
  )

// make a lookup index of all stores by their id property,
// returns {[store.id]: store}  
export const getStoresById = derive([getStores], R.indexBy(R.prop("id")))

export const getNonWalmartStores = derive(
  // an array of selector functions (as many as you want)
  [getWalmartStores,getStoresById],
  // an argument for each value returned by the selector functions in the above array, in the order they appear in the array
  (walmartStores, storesById)=> {
  // return
  })
```




Let's make a new file in `client/src/app/selectors.js` for all our app selectors to live.

We define a base selector that gets the stores as they were written to the `db`:
```js
import * as R from 'ramda'

export const getStores = R.pathOr([], ['data', 'stores'])
```

Note:
- If you're still learning Ramda, this defines a function equivalent to `db => R.path(['data', 'stores'], db) || []`,
where `R.path` is the same as `db.data.stores` except it returns `undefined` (and won't error) if `db.data` is `undefined`.
We provide a default value of `[]` so callers receive the same category of thing (an array) they'd expect `stores` to have.
There's other ways of handling this. This is just one option.

- See the [Ramda docs](https://ramdajs.com/docs/) for more info on Ramda functions.


Now that we have a way to select the raw stores data, we can edit our `getStoresLayer` function
to `derive` from it. From there we can just assign the resulting stores to the `ScatterplotLayer`'s `data` key.

Our `client/src/app/layerSelectors.js` should now be complete and look like:
```js
import { ScatterplotLayer } from 'deck.gl'
import { getStores } from './selectors'
import { derive } from 'framework-x'


export const getStoresLayer = derive([
    getStores
  ],
  (stores) => {
    return new ScatterplotLayer({
      id: 'stores',
      data: stores,
      opacity: 0.8,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      getColor: d => [255, 0, 0],
      getPosition: d => [d.longitude, d.latitude],
      getRadius: d => 100
    })
  }
)
```

Note:
- `derive` is part of `framework-x`. It turns the selector `getStores` into the variable `stores` for use in the rest of the derivation. In fact, it trims off the `get` from all imputed selectors and camel case formats the remaining string as a new variable. For example `getMyVar` would become `myVar`.

#### Registering a layer
Now we can go back to the layer registry in `client/src/views/map/layers.js` and import `getStoresLayer`
from the file we created it in:
```js
import { getStoresLayer } from '../../app/layerSelectors'

export const MAP_LAYERS = {
  stores: getStoresLayer
}
```

There's one last step:
`cave-app` assumes we'll have more than one data visualization layer,
and that we don't want all layers showing at the same time by default.

We can specify that we want a layer to show when our app starts in `client/src/events/generalEvents.js`
by adding the name of our layer to the initial app state:
```js
regEventFx(coreEvent.INITIALIZE_DB, () => ({
  db: mergeOp({
    lastParamsForRoute: {
      [routeIds.DASHBOARD]: {
        dashboardId: 'a'
      }
    },
    sessionVars: {},
    showLayers: { stores: true }
  })
}))
```
At this point you should have a red dot on the map for each Walmart store location in the United States.

![image](https://user-images.githubusercontent.com/9045165/61462555-a810c200-a927-11e9-8399-3e9a299bc2fe.png)



## Toggling layer visibility

We want to be able to control what layers are showing from the UI. This is most useful once you have more than one layer
and want to focus on some but not others.

Most of this functionality is already built into the `cave-app` template and our libraries.
We'll be using the `CHANGE_LAYER_VISIBILITY` event from `@mit-cave/map`, which updates the `true/false` value
of a `layerId` in `db.showLayers`. The base example below provides the source code for its event handler in `mit-cave/map/index.js`:

```js
regEventFx(mapEvent.CHANGE_LAYER_VISIBILITY, (__, _, [layer, visible]) => ({
    db: R.assocPath(['showLayers', layer], visible)
  }))
```

This means whenever we `dispatch` the `mapEvent.CHANGE_LAYER_VISIBILITY` event with
an array of `[firstThing, secondThing]` for its payload argument, it will set `showLayers.firstThing` to whatever value we provide for `secondThing`.
The rest of the framework provides the view-level implementation
for rendering certain layers but not others based on this data.
As we saw when we added `showLayers: {stores: true}`, all we have to do is change the data.

We typically put layer controls in `MapLegend` component in `client/src/views/control/MapLegend.js`.
It's currently rendering "None" when we click on it in the bottom of the UI:
![image](https://user-images.githubusercontent.com/9045165/61547840-0e1d4800-aa01-11e9-86b8-7a22b641f439.png)

Let's add a switch that toggles the visibility of our stores layer.

For this we can make our own component based on the `Toggle` component from `@mit-cave/ui`.
This is a low-level, pure component that returns markup based on the arguments it receives.

Note:
- Arguments to React components are often called `props`. They are just like normal function arguments except their value across time determines whether the component renders.
- The `props` comparison is not by value but by reference, using `===` by default, where `[] === []` and `{} === {}` are both false!
- If a component's `props` are the same (by `===`, reference equality) from one React render to the next, React does no work for that component.
- If they're different, React calls the component's render function and compares
the returned markup for differences to determine whether it needs to update the DOM.

`Toggle` takes 3 `props`:
  - `value`: the text that shows next to the toggle button
  - `label`: the boolean value that determines whether the switch button shows on or off
  - `onChange`: the function called whenever the toggle is clicked or touched.

Given this we can reasonably add a toggle with the following arguments inside `client/src/views/control/MapLegend`:
```js
import { Toggle } from 'mit-cave'
...

<Toggle
  label={"Stores"}
  value={layerVisibility["stores"]}
  onChange={value => dispatch(mapEvent.CHANGE_LAYER_VISIBILITY, ["stores", value])}
/>
...
```

We should also make the necessary imports for `mapEvent` and `toggle`. We should also call `dispatch` (which comes as a variable with `createSub`) to dispatch our `mapEvent`.

The complete `client/src/views/control/MapLegend` should look like:
```js
import { Form, Pad, Toggle } from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { createSub } from '../../common'
import {
  getLayerVisibility,
  getPad,
  withWiredPadProps
} from '../../features'
import { mapEvent } from '../../mit-cave/map/event'

const PAD_ID = 'mapLegend'

export const MapLegend = component(
  'MapLegend',
  createSub({
    getLayerVisibility,
    pad: getPad(PAD_ID)
  }),
  ({ pad, layerVisibility, dispatch }) => {

    return (
      <Pad
        size="small"
        {...withWiredPadProps({ pad, padId: PAD_ID, defaultX: 0 })}
        title="Map Legend"
      >
        <Form>
          <Toggle
            label={"Stores"}
            value={layerVisibility["stores"]}
            onChange={value => dispatch(mapEvent.CHANGE_LAYER_VISIBILITY, ["stores", value])}
          />
        </Form>
      </Pad>
    )
  }
)

```
Note:
- In addition to the original key name, `createSub` will automatically remove "get" from any key that starts with it and pass the component a key camel-cased version of the string that remains.
- This avoids some repetition and common renaming. It's completely optional; you can get the same value by destructuring with `getLayerVisibility`, too.
We're reading from `layerVisibility` which is returned by the selector.
- The selector `getLayerVisibility` is defined in `mit-cave/map/index.js`. We can see from the definition it just returns the `showLayers` map.
- We use this to to define whether the toggle is active as a function of the the current `db` state.

Going back to the UI we can see the toggle rendering and working as expected.

![image](https://user-images.githubusercontent.com/9045165/61550917-a2d77400-aa08-11e9-87d1-df282e632332.png)

![image](https://user-images.githubusercontent.com/9045165/61550964-c3073300-aa08-11e9-9273-cb590026a6b5.png)

# Adding a marker layer

Markers are useful for showing icons or images at specific lat long coordinates.

We'll show how to create a marker layer that renders a red pin icon at MIT CTL headquarters.

```
import { IconLayer } from 'deck.gl'

const keyLocations = [{
  iconImageURL: 'data:image/png;base64,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',
  latLng: [42.3611499, -71.0870345]
}]

export const MAP_LAYERS = {
  stores: getStoresLayer,
  ctl: () => new IconLayer({
    id: 'ctl',
    data: keyLocations,
    getSize: ()=> 20,
    getIcon: d => ({
      url: d.iconImageURL,
      width: 54,
      height: 86,
    }),
    getPosition: d => d.latLng.reverse()
  })
```

In `client/views/control/MapLegend.js` we add another `Toggle` button.
```
<Toggle
  label={"MIT CTL"}
  value={layerVisibility["ctl"]}
  onChange={value => dispatch(mapEvent.CHANGE_LAYER_VISIBILITY, ["ctl", value])}
/>
```

# Adding a dashboard

CAVE apps ship with two dashboard examples accessible from the UI via the bottom-left:

Dashboards are set up with their own client-side route at `/dashboard/:dashboardId`. 

We'll add a new dashboard from scratch to show how this works.

## Routing

First let's orient ourselves with how the Dashboards show on the page in the first place.

The `App` component in `client/src/views/App.js` is our root React component. Everything that shows on the screen is
defined within this component somehow or other. ReactDOM mounts it to the DOM directly when the application starts in
`client/src/index.js`, which is the root client file. 

`client/src/index.js`
```js
ReactDOM.render(
  <Provider
    getState={getState}
    dispatch={dispatch}
    subscribeToState={subscribeToState}
  >
    <App />
  </Provider>,
  document.getElementById('root')
)
```

Note: `Provider` is technically outermost React component. It gives the tree of components nested within it with the
ability to subscribe to the `db` via `component` and `createSub`, but it doesn't render any application-specific components. 

The `App` component determines what to render based upon the current route state in the `db`: 

`client/src/views/App.js`
```js
const App = component(
  'App',
  createSub({
    getInitialDataReady,
    getRouteId,
    getRouteArgs,
    getIsConnected
  }),
  ({ routeId, isConnected }) => (
    <Div
      css={{
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.radiantGraphite,
        color: theme.offWhite
      }}
    >
      <FlatNav visible={routeId !== routeIds.SESSIONS} />
      {invoke(() => {
        switch (routeId) {
          case routeIds.DASHBOARD:
            return <Dashboard />
          case routeIds.MAP:
            return <Map />
          case routeIds.SESSIONS:
            return <Sessions />
          default:
            return <RouteNotFound />
        }
      })}
      {!isConnected && <DisconnectedMask />}
    </Div>
  )
)
```

The `switch` statement returns components that are effectively pages. They will more or less take up the entire screen.

Client-side routes are defined in `client/src/routes.js`. 

```js
export const routeIds = {
  ROOT_INCOMPLETE: 'root-incomplete',
  MAP: 'map',
  DASHBOARD_ROOT: 'dashboard-root',
  DASHBOARD: 'dashboard',
  SESSIONS: 'sessions',
  SESSION_ROOT: 'session-root'
}
export const routes = [
  {
    id: routeIds.ROOT_INCOMPLETE,
    path: '/',
    action: () => ({
      redirect: ['sessions']
    })
  },
  {
    id: routeIds.SESSION_ROOT,
    path: '/session/:sessionId',
    action: ({ params }) => ({
      redirect: ['map', { sessionId: params.sessionId }]
    })
  },
  {
    id: routeIds.MAP,
    path: '/session/:sessionId/map'
  },
  {
    id: routeIds.DASHBOARD_ROOT,
    path: '/session/:sessionId/dashboard',
    action: ({ params }) => {
      return {
        redirect: [
          'dashboard',
          { sessionId: params.sessionId, dashboardId: 'a' }
        ]
      }
    }
  },
  {
    id: routeIds.DASHBOARD,
    path: '/session/:sessionId/dashboard/:dashboardId'
  },
  {
    id: routeIds.SESSIONS,
    path: '/sessions'
  }
]
```

`routeIds` are constants used to identify each route the app has. `routes` defines the mapping between them and their
URLs, e.g. `{ id: routeIds.DASHBOARD, path: '/session/:sessionId/dashboard/:dashboardId' }`. The syntax `:dashboardId`
denotes a parameter. Like a function parameter, it's replaced with a value when the path is matched, e.g.
`/session/default/dashboard/a` substitutes `default` for `:sessionId` and `a` for `:dashboardId`. Parameters are
accessible as a map of `{[parameterName]: parameterValue}` at `db.router.match.params` or the `getRouteArgs` selector
exported by `mit-cave/routes`.

As we saw above, the`Dashboard` component in `client/src/views/dashboard/Dashboard.js` is rendered whenever the routeId
is `routeIds.DASHBOARD`. Looking at its source shows a pattern similar to the one in `App`:

```js
const switchDashboard = (dashboardId, topNav) => {
  switch (dashboardId) {
    case 'a':
      return <DashboardA topNav={topNav} />
    case 'b':
      return <DashboardB topNav={topNav} />
    default:
      return `Dashboard "${dashboardId}" not found`
  }
}

export const Dashboard = component(
  'Dashboard',
  createSub({
    getRouteArgs,
    getTopNav: derive(getOverallLayout, R.equals('top'))
  }),
  ({ routeArgs, topNav }) => (
    <Div>
      <Div
        css={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          backgroundColor: theme.radiantGraphite
        }}
      >
        {switchDashboard(routeArgs.dashboardId, topNav)}
      </Div>
    </Div>
  )
)
```
Just like `App` chooses what page-level component to render as a function of `routeId`, `Dashboard` chooses which
dashboard component to render as a function of`routeArgs`.

Let's add a new dashboard that takes up the whole screen called `"stores"`. 

Create a new file `client/src/views/dashboard/StoresDashboard.js` using `FruitsLineChart` as a placeholder chart:

```js 
import { FullScreenContainer } from 'mit-cave' import { component } from 'framework-x' import React from 'react'
import { FruitsLineChart } from './FruitsLineChart'

export const StoresDashboard = component('StoresDashboard', ({ topNav }) => (
  <FullScreenContainer topNav={topNav}>
    <FruitsLineChart />
  </FullScreenContainer>
))
```

Update `switchDashboard` in `client/src/views/dashboard/Dashboard.js` to render it when the dashboardId route param is
`stores`:

```js
const switchDashboard = (dashboardId, topNav) => {
  switch (dashboardId) {
    case 'a':
      return <DashboardA topNav={topNav} />
    case 'b':
      return <DashboardB topNav={topNav} />
    case "stores":
      return <StoresDashboard topNav={topNav} />
    default:
      return `Dashboard "${dashboardId}" not found`
  }
}
```

You should be able to see the full screen dashboard at `localhost:4000/session/default/dashboard/stores`
![image](https://user-images.githubusercontent.com/9045165/65789095-6fece300-e111-11e9-98d8-4302bcc901ac.png)


## Adding a chart
Let's build a custom chart for the Walmart dataset of a stacked bar chart showing the quantity of each types of stores
in each state.

As we go along it can be helpful to reference the visual of the finished chart, which looks like this:
![image](https://user-images.githubusercontent.com/9045165/66053624-80bda000-e4e7-11e9-9686-28af1f0e4555.png)

For each state, we'll render a bar for each store type, represented by the colored bar segments. The y value of the bar
segments will be equal to the number of stores for that type. This means if we take all bar segments and add their y
values,  we should get the total number of stores in the state.


Add a new file in `client/src/views/dashboard/StoresStackedBarChart.js`. We've created this tutorial by copying the full
contents of `FruitsLineChart` and modifying it.

We suggest copying in the finished code and following along as we walk through it.

```js
import {
  Autosized,
  CaveChart,
  LegendKey,
  MultiViz,
  VerticalLegend,
  Viz,
  VizHeader
} from 'mit-cave'
import * as R from 'ramda'
import { component, createSub, derive } from 'framework-x'
import React from 'react'
import {
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis'
import { getStores } from '../../stores/selectors'

const defaultColorsHex = [
  '#19CDD7',
  // '#DDB27C',
  // '#88572C',
  '#FF991F',
  '#F15C17',
  '#223F9A',
  '#DA70BF',
  '#125C77',
  '#4DC19C',
  // '#776E57',
  // '#12939A',
  // '#17B8BE',
  // '#F6D18A',
  '#B7885E',
  '#FFCB99',
  '#F89570',
  '#829AE3',
  '#E79FD5',
  '#1E96BE',
  '#89DAC1',
  '#B3AD9E'
]
const pickColor = (k, cache, index, colors) => {
  const picked = cache[k]
  if (picked) return picked
  const color = colors[index.value]
  index.value = (index.value + 1 > colors.length - 1)
                ? 0
                : index.value + 1
  cache[k] = color
  return color
}

export const makeColorPicker = (colors) => {
  let cache = {}
  let index = { value: 0 }
  return k => pickColor(k, cache, index, colors)
}

const storeColor = makeColorPicker(defaultColorsHex)

const StoresChartInternal = ({
  width, height, xAxisTitleProp, yAxisTitleProp, data
}) => {
  return (
    <CaveChart>
      <XYPlot width={width} height={height}
              stackBy={'y'}
              xType={'ordinal'}
      >
        <HorizontalGridLines />
        <VerticalGridLines style={{ stroke: 'none' }} />
        <XAxis title={xAxisTitleProp} />
        <YAxis title={yAxisTitleProp} />
        {R.chain(([state, storeTypesToCount]) => {
          return R.values(R.mapObjIndexed((count, storeType) => {
            return <VerticalBarSeries
              key={`${state}/${storeType}`}
              data={[{ x: state, y: count }]}
              stroke={'none'}
              fill={storeColor(storeType)}
            />
          }, storeTypesToCount))
        }, Object.entries(data))}
      </XYPlot>
    </CaveChart>
  )
}

export const StoresChartOnly = component(
  'StoresChartOnly',
  createSub({ stores: getStores }),
  ({ width, height, stores }) => {
    const byState = R.groupBy(R.prop('state'), stores)
    const byStateAndStoreType = R.map(R.groupBy(R.prop('storeType')), byState)
    const byStateAndStoreTypeCounts = R.map(R.map(R.length), byStateAndStoreType)

    return (
      <StoresChartInternal
        width={width}
        height={height}
        data={byStateAndStoreTypeCounts}
        xAxisTitleProp={'U.S. States'}
        yAxisTitleProp={'# of stores'}
      />
    )
  })

const getStoresLegend = derive([getStores],
  stores =>
    R.map(
      R.zipObj(['title', 'color']),
      R.map(R.juxt([R.prop('name'), R.compose(storeColor, R.prop('storeType'))]),
        R.uniqBy(R.prop('storeType'),
          stores))))

export const StoresChart = component(
  'StoresChart',
  createSub({ legend: getStoresLegend }),
  ({ name, description, legend }) => (
    <MultiViz
      css={{
        height: 800
      }}
    >
      <Viz>
        <VizHeader title={name} subtitle={description} />
        <Autosized>
          <StoresChartOnly />
        </Autosized>
      </Viz>
      <VerticalLegend>
        {legend.map(({ color, title }) => (
          <LegendKey key={title} title={title} color={color} />
        ))}
      </VerticalLegend>
    </MultiViz>
  )
)

```

The `StoreChartInteral` component is responsible for rendering the chart using `react-vis`. It requires data in a
particular format provided by its parent components derived from the raw Walmart store data returned by `getStores`,
which is an array of objects with this shape:
```json
{
  "id": 6601,
  "storeType": 3,
  "timeZone": "K",
  "openDate": "01/04/1994 12:00",
  "name": "Sam's Club",
  "postalCode": "99515",
  "address1": "8801 Old Seward Hwy",
  "city": "Anchorage",
  "state": "AK",
  "country": "US",
  "latitude": 61.14076995,
  "longitude": -149.86001586,
  "phone_number": "(907) 522-2333"
}
```

From this, we need to instruct `react-vis` to render `state` (S) on the x-axis, then for each `storeType` (T) to render
a bar of size N and color C, where N is equal to the count of `storeType` T in S. o Vertical stacked bar charts in
`react-vis` are rendered by specifying a `stackBy` property of `y` on `XYPlot`. This means for every `x`, any `y` value
associated with that particular `x` value (e.g. `"MA"`) will be stacked on top of with a magnitude equal to its value
(`y`). This ultimately forms a single bar for `x` equal to `Y`, the sum of all `y` values for `x`. 

Because `react-vis` expects data to be formatted as `{x, y}` pairs, we need to think in these terms. Doing so is
somewhat misleading for this chart, however, since there is 3rd dimension for the type of store being counted as `y`
that will be represented as a particular color.

At the least, independent of the chart or `react-vis`'s API, we want to know what stores are in each state:

```js 
// {state -> stores[]}
const byState = R.groupBy(R.prop('state'), stores)
```
This creates a map that associates each state value in stores with the stores matching that value.

We further know we want to know the store types within each state.
```js 
// {state -> stores[]} => {state -> storeType -> stores[]}
const byStateAndStoreType = R.map(R.groupBy(R.prop('storeType')), byState)
```
`R.map` on a Javscript Object acts as a "mapValues" function. Here, it maps the same `groupBy` operation as above on all
stores within a state, returning the original map with its values as the return value of `groupBy` "storeType" --
another map.

Ultimately, we want to know how many of each store type in each state. Because the value of state->storeType is an array
of stores, the number of stores in a particular state of a particular store type is equal to length of the array at that
path.
```js 
// {state -> storeType -> stores[]}  => {state -> storeType -> number of stores of this type in this state}
const byStateAndStoreTypeCounts = R.map(R.map(R.length), byStateAndStoreType)
```
We again leverage `R.map`'s `mapValues` behavior to apply the `length` function to the stores array. The first `R.map`
applies the second `R.map` to its values. Since that's another map, the length function is applied to its values. Both
object structures are unaffected -- we're only applying functions to the values of each key in each map. The first and
second map functions are called with objects and return objects, so nothing modifies the nested structure .

With the resulting data structure, we have mappings like "MA" (state) -> 42 (storeType) -> 3 (count). Hopefully this
bears some resemblance to how you might think about what we're representing. Reading it backwards, "There are 3 store
type 42s in Massachusetts." Or forwards, "In Massachusetts, how many 42 type stores are there?" "3". 

With this structure, the application can easily and efficiently answer other questions about the dataset if desired. How many
states are in the dataset? `R.length(R.keys(data)))` How many store types are in Massachusetts? `R.length(
R.keys(R.prop("MA", data))`



When we provide our chart with this data, there's a little more work required to get it to render correctly. For one, we
need to color the bar segments. We've built a simple color picker that maps its argument to a color by storing its
arguments in a map and returning a color for which it has a mapping or creating a new mapping for and returning the
color. We'll use this function to get the same color for a store type.

With this and our data we have everything we need to render the chart.

```js
const storeColor = makeColorPicker(defaultColorsHex)

const StoresChartInternal = ({
  width, height, xAxisTitleProp, yAxisTitleProp, data
}) => {
  return (
    <CaveChart>
      <XYPlot width={width} height={height}
              stackBy={'y'}
              xType={'ordinal'}
      >
        <HorizontalGridLines />
        <VerticalGridLines style={{ stroke: 'none' }} />
        <XAxis title={xAxisTitleProp} />
        <YAxis title={yAxisTitleProp} />
        {R.chain(([state, storeTypesToCount]) => {
          return Object.entries(storeTypesToCount).map(([storeType,count]) => {
            return <VerticalBarSeries
              key={`${state}/${storeType}`}
              data={[{ x: state, y: count }]}
              stroke={'none'}
              fill={storeColor(storeType)}
            />
          }, storeTypesToCount)
        }, Object.entries(data))}
      </XYPlot>
    </CaveChart>
  )
}
```

A few things to note on iterating over our data. The keys of our maps contain important information for our chart, so we
need to be able to access them when iterating over them. Further, we need to map an object of objects to a list of React
components. We use `R.chain` (i.e. "flat map"). This allows us to write a function that returns an array of arrays in one
list.

We use Object.entries to give us a list of `[key,value]` pairs from our `state->storeType->count` data as `[state,
storeTypesToCount]`. We then map the entries of `storeTypesToCount` as `[storeType, count]` to a `VerticalBarSeries`
where `x` is the state, `y` is the `count`, and the color is a function of `storeType`.

For the legend, we can use the `@mit-cave/ui` components `VerticalLegend` and `LegendKey` as provided in other charts.
All we need are a list of `{color, title}` pairs. 

Here is one way to obtain a legend from our store data:

```js
const getStoresLegend = derive([getStores],
  stores =>
    R.map(
      // map the list of [name,color] and create an object for each {title:name,  color: color} 
      R.zipObj(['title', 'color']),
      //  map the juxtaposition of its name and it's store type into our color function
      // returns [name, color] for each unique store (`juxt` applies its list of functions to its arguments one at a time, returning the result of each function in order as a list)
      R.map(R.juxt([R.prop('name'), R.compose(storeColor, R.prop('storeType'))]),
        // return the list as a set of objects with distinct "storeType"s (doesn't matter which we get, just eliminate duplicates)
        R.uniqBy(R.prop('storeType'), 
        //take all stores
          stores)))) 
```


```js
export const StoresChart = component(
  'StoresChart',
  createSub({ legend: getStoresLegend }),
  ({ name, description, legend }) => (
    <MultiViz
      css={{
        height: 800
      }}
    >
      <Viz>
        <VizHeader title={name} subtitle={description} />
        <Autosized>
          <StoresChartOnly />
        </Autosized>
      </Viz>
      <VerticalLegend>
        {legend.map(({ color, title }) => (
          <LegendKey key={title} title={title} color={color} />
        ))}
      </VerticalLegend>
    </MultiViz>
  )
)
```

Finally we can change our navigation to reflect our new chart.

In `client/src/views/Nav.js` we can replace the placeholder dashboard routes with our new one:

```js
<NavigationTab value={[routeIds.MAP, {}]}>Map</NavigationTab>
<NavigationTab value={[routeIds.DASHBOARD, { dashboardId: 'stores' }]}>
  Stores by State
</NavigationTab>
```
