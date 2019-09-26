# FAQ

### How do I add a new route?

CAVE applications are single-page apps (SPAs), so all routes are configured in the browser.

Take a look at [routes.js](https://github.com/MIT-CAVE/cave-template/blob/dbe3f2dc90effde0534f3281e978c76f287a7032/with-model/client/src/routes.js#L1)

Routes are defined by at least two things: a route id and a path.

The route id can be any string and should be added to the `routeIds` map so you can refer to it easily throughout the application.

The route path should start with and be delineated by `/` and may accept optional route parameters prefixed with `:`.

Example:
`/session/:sessionId/dashboard`

To specify the page component that renders when the route is matched, see [the switch statement in App.js](https://github.com/MIT-CAVE/cave-template/blob/master/with-model/client/src/views/App.js#L45)
that returns a component based on the `routeId` in the current state.

### How can fix/add to cave-ui while keeping cave-template in-sync ?

Sometimes you are developing in `cave-ui` a component that you wouuld like to see in-place within `cave-template`

First, obviously, always add some storybook stories within `cave-ui` so you can see the component that you are building
without having to make a round-trip to `cave-template`. The `playground` area within storybook
is a good place to put case-specific combinations of components.

That said, sometimes you just need to see it in `cave-template` as you build in `cave-ui`.

The simplest way is to use `yarn link`.

**Make locally available**

In a terminal in the root of your `cave-ui` directory, type in:

`yarn link`

Whenever you build, that will now "locally publish" it to any other app dependent on that library and linked to it.
(Under the covers it's just a symlink).

**Build**

So build `cave-ui` with

`yarn build`

**Link `cave-template` to local `cave-ui`**

In a terminal in the root of your `cave-template` directory, type in:

`yarn link cave-ui`

That will now make `cave-template` use the local build output for resolving `cave-ui`

**Just build cave-ui and watch it update**

From there on out, you can build `cave-ui` (`yarn build`) and `cave-template` will reload with the latest local version.

**Unlink when you're done**

In the root of `cave-template`, run:

`yarn unlink cave-ui`

To break the local link. Make sure your `cave-ui` is committed, grab its git checksum and update the checksum of `cave-ui` 
in `package.json` to point to the right directory.

You should probably also run `yarn` to make sure it is all synced up correctly.
