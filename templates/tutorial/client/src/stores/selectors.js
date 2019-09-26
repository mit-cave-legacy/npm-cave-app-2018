import * as R from 'ramda'
import { derive } from 'framework-x'
import { ScatterplotLayer } from 'deck.gl'


export const getStores = R.pathOr([], ['data', 'stores'])

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
