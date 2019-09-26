import { Autosized, CaveChart, Viz, VizHeader } from 'mit-cave'
import { component } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import {
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis'
import { createSub } from '../../common'
import { getProportionalData } from '../../subs'

const mapXy = (xProp, yProp, data) =>
  R.map(
    item => ({
      x: R.prop(xProp, item),
      y: R.prop(yProp, item)
    }),
    data
  )

export const ZipBarSeriesChartOnly = component(
  'ZipBarSeriesChartOnly',
  createSub({
    getProportionalData
  }),
  ({ width, height, proportionalData }) => (
    <CaveChart>
      <XYPlot stackBy="y" width={width} height={height}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis tickValues={[1, 2, 3]} />
        <YAxis />
        <VerticalBarSeries
          data={mapXy('version', 'inactive', proportionalData)}
        />
        <VerticalBarSeries
          data={mapXy('version', 'active', proportionalData)}
        />
      </XYPlot>
    </CaveChart>
  )
)
/* Uses react-vis for a bar series. For simpler, "out-of-the-box" visualizations,
 * a react-vis approach is great.
 * One consideration: if there are going to be a great number of items that will be animated,
 * (100s to 1000s), react-vis should not be your approach. Between its physics-based animation
 * library (react-motion) and the react update loop overhead, we've found that animations can be an
 * order-of-magnitude slower than a direct D3 approach.
 */
export const ZipBarSeries = component(
  'ZipBarSeries',
  ({ name, description }) => (
    <Viz>
      <VizHeader title={name} subtitle={description} />
      <Autosized>
        <ZipBarSeriesChartOnly />
      </Autosized>
    </Viz>
  )
)
