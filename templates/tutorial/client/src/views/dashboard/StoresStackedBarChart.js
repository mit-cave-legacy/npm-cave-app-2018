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
          return Object.entries(storeTypesToCount).map(([storeType, count]) => {
            return <VerticalBarSeries
              key={`${state}/${storeType}`}
              data={[{ x: state, y: count }]}
              stroke={'none'}
              stack={true}
              fill={storeColor(storeType)}
            />
          })
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
