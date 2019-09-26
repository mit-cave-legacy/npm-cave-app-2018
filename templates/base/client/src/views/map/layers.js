/**
 * Map of layerId -> Layer
 *
 * Layer may be a memoized function that accepts the `db` as an argument and returns a DeckGL.Layer
 *
 * `layerId` should correspond to the values set in `db.showLayers[layerId]`.
 * MAP_LAYERS[layerId] is rendered whenever showLayers[layerId] is true.
 *
 */
export const MAP_LAYERS = {}
