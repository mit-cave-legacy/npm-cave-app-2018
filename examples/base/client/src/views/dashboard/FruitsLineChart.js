import {
  Autosized,
  CaveChart,
  LegendKey,
  MultiViz,
  theme,
  VerticalLegend,
  Viz,
  VizHeader
} from 'mit-cave'
import { curveCatmullRom } from 'd3-shape'
import { component } from 'framework-x'
import React from 'react'
import {
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis'

const list1 = [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 15 }, { x: 4, y: 12 }]

const list2 = [{ x: 1, y: 10 }, { x: 2, y: 4 }, { x: 3, y: 2 }, { x: 4, y: 15 }]

const list3 = [{ x: 1, y: 7 }, { x: 2, y: 11 }, { x: 3, y: 9 }, { x: 4, y: 2 }]

const theLegend = [
  {
    title: 'apple',
    color: theme.chartLightBlue
  },
  {
    title: 'banana',
    color: theme.chartOrange
  },
  {
    title: 'pear',
    color: theme.chartDarkBlue
  }
]

const FruitLineChartInternal = ({ width, height, ...props }) => (
  <CaveChart>
    <XYPlot width={width} height={height}>
      <HorizontalGridLines />
      <VerticalGridLines style={{ stroke: 'none' }} />
      <XAxis title={props.xAxisTitleProp} />
      <YAxis title={props.yAxisTitleProp} />
      <LineSeries
        data={props.dataList1}
        style={{
          strokeLinejoin: 'round',
          strokeWidth: 4,
          stroke: `${props.legend[0].color}`
        }}
      />
      <LineSeries
        style={{
          stroke: `${props.legend[1].color}`
        }}
        curve={'curveMonotoneX'}
        data={props.dataList2}
        strokeDasharray="7, 3"
      />
      <LineSeries
        style={{
          stroke: `${props.legend[2].color}`
        }}
        curve={curveCatmullRom.alpha(0.5)}
        data={props.dataList3}
      />
    </XYPlot>
  </CaveChart>
)

export const FruitsLineChartOnly = component(
  'FruitsLineChartOnly',
  ({ width, height }) => (
    <FruitLineChartInternal
      width={width}
      height={height}
      dataList1={list1}
      dataList2={list2}
      dataList3={list3}
      xAxisTitleProp={'x axis'}
      yAxisTitleProp={'y axis'}
      mainTitleProp={'Main Title'}
      subTitleProp={'Subtitle'}
      legend={theLegend}
    />
  )
)

export const FruitsLineChart = component(
  'FruitsLineChart',
  ({ name, description }) => (
    <MultiViz
      css={{
        height: 800
      }}
    >
      <Viz>
        <VizHeader title={name} subtitle={description} />
        <Autosized>
          <FruitsLineChartOnly />
        </Autosized>
      </Viz>
      <VerticalLegend>
        {theLegend.map(({ color, title }) => (
          <LegendKey key={title} title={title} color={color} />
        ))}
      </VerticalLegend>
    </MultiViz>
  )
)
