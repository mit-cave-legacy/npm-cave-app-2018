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
they run. Right now they are set up to call app. If you create a different file structure, you will need to import them because no part of our program actually requires (or `import`s) these files that were created.

Before going further, check to make sure this is importing correctly from app in both the client and server:

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
- If you use, different names, this will need to be reflected in each respective `index` file

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

Since we're still working with a specific `appEvent`, let's add a handler in
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

Note: We can do this because the order of events isn't important. If they needed to happen in order, we can always use `emitN` (like in the first example). This would guarantee the first event is dispatched before the second. In this case we would still want to call emitN from `client/src/app/events.js`. In this case, we may need to remove emitN from the `client/src/mit-cave/data/index.js`. This may cause issues when pulling a new version of the app.

The client should now have the stores data.
- You can verify this by evaluating `window._store.getState()` from the browser console.
  - `_store` is specifically not related to our `stores` data, but the way that browsers process data.
- For the stores data, expand the object and check `data/stores` where you should see a list of walmart store locations.

## Adding the scatterplot layer

Map layers are registered in `client/src/views/map/layers.js` as functions that
receive the `db` and return a `deck.gl` `Layer`.

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
- This is useful in many settings, but it's especially useful for React apps,
since it can help us tell `React` that it shouldn't render when our data hasn't changed, avoiding unnecessary virtual DOM reconciliation.


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
Base selectors read from the `db` directly. They perform return minimal transformations, if any.
Often, they're just doing the equivalent of `db.foo.bar`. That's ok!
There are two main reasons to use them, one related to computer performance, the other to developer performance.
1. Defining even the simplest of getters as function and using them in a selector chain means they will be memoized, ensuring
any computation they perform will be run at most one time per `db` state change.
2. We can easily change how a function like `getStores` works. We might later want to get the stores from `db.walmart.stores`.
As long as it returns the same thing it did before, all computations derived from it are guaranteed to work.

The other category of selectors are "derived". They chain off of and depend upon the return value of other selector functions.
By this we mean their inputs are base selectors, other derived selectors, or a combination of both.

The `derive` function lets us define a new selector with explicit inputs. It's generally not possible or desired to
use `derive` with the whole `db` state. Instead, we exclude everything that's irrelevant
to the function we're defining and only work with the data we care about.

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
