import { storiesOf } from '@storybook/react'
import { curveCatmullRom } from 'd3-shape'
import React from 'react'
import { css } from 'react-emotion'
import {
  AreaSeries,
  HorizontalBarSeries,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis'
import { MultiViz, RaisedBox } from '../compound'
import { TitledViz } from '../compound/Viz'
import { chart } from '../storyConsts'
import { chartDarkBlue, chartLightBlue, chartOrange, lightGrey } from '../theme'
import { Autosized } from './Autosized'
import { CaveChart } from './CaveChart'
import { LegendKey, VerticalLegend } from './Legend'

const backgroundStyle = css({
  backgroundColor: lightGrey,
  width: '100%',
  height: '100vh'
})

const legend = [
  {
    title: 'apple',
    color: chartLightBlue
  },
  {
    title: 'banana',
    color: chartOrange
  },
  {
    title: 'pear',
    color: chartDarkBlue
  }
]

// Example Line Chart data
const list1 = [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 15 }, { x: 4, y: 12 }]

const list2 = [{ x: 1, y: 10 }, { x: 2, y: 4 }, { x: 3, y: 2 }, { x: 4, y: 15 }]

const list3 = [{ x: 1, y: 7 }, { x: 2, y: 11 }, { x: 3, y: 9 }, { x: 4, y: 2 }]

// Example Bar Chart data
const categoryList = [
  { x: 1, y: 'category 1' },
  { x: 2, y: 'category 2' },
  { x: 3, y: 'category 3' },
  { x: 4, y: 'category 4' }
]

// Example Area Chart data
// stack areas such that first series has y0 initialized at 0
const areaList1 = [
  { x: 1, y: 10, y0: 0 },
  { x: 2, y: 20, y0: 0 },
  { x: 3, y: 15, y0: 0 }
]

// stack remaining areas such that y is the cumulative value so far, and y0 takes on the antecedant y value
const areaList2 = [
  { x: 1, y: 15, y0: areaList1[0].y },
  { x: 2, y: 37, y0: areaList1[1].y },
  { x: 3, y: 22, y0: areaList1[2].y }
]

const areaList3 = [
  { x: 1, y: 22, y0: areaList2[0].y },
  { x: 2, y: 40, y0: areaList2[1].y },
  { x: 3, y: 30, y0: areaList2[2].y }
]

export const ExampleLineChart = ({ width, height, ...props }) => (
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

export const ExampleBarChart = ({ width, height, ...props }) => (
  <CaveChart>
    <XYPlot
      margin={{ left: 100 }}
      width={width}
      height={height}
      yType="ordinal"
    >
      <HorizontalGridLines />
      <VerticalGridLines style={{ stroke: 'none' }} />
      <XAxis title={props.xAxisTitleProp} />
      <YAxis />
      <HorizontalBarSeries data={props.dataList1} />
    </XYPlot>
  </CaveChart>
)

export const ExampleAreaChart = ({ width, height, ...props }) => (
  <CaveChart>
    <XYPlot width={width} height={height}>
      <HorizontalGridLines />
      <VerticalGridLines style={{ stroke: 'none' }} />
      <XAxis title={props.xAxisTitleProp} />
      <YAxis />
      <AreaSeries color={`${props.legend[0].color}`} data={props.dataList1} />
      <AreaSeries color={`${props.legend[1].color}`} data={props.dataList2} />
      <AreaSeries color={`${props.legend[2].color}`} data={props.dataList3} />
    </XYPlot>
  </CaveChart>
)

storiesOf(chart('CaveChart'), module)
  .add('Line Chart with header and side-legend', () => (
    <div className={backgroundStyle}>
      <RaisedBox>
        <MultiViz
          css={{
            height: 800
          }}
        >
          <TitledViz
            title="A sample line chart"
            subtitle="A masterpiece in charting"
          >
            <Autosized>
              <ExampleLineChart
                dataList1={list1}
                dataList2={list2}
                dataList3={list3}
                xAxisTitleProp={'x axis'}
                yAxisTitleProp={'y axis'}
                mainTitleProp={'Main Title'}
                subTitleProp={'Subtitle'}
                legend={legend}
              />
            </Autosized>
          </TitledViz>
          <VerticalLegend>
            {legend.map(({ color, title }) => (
              <LegendKey title={title} color={color} />
            ))}
          </VerticalLegend>
        </MultiViz>
      </RaisedBox>
    </div>
  ))
  .add('Bar Chart with header', () => (
    <div className={backgroundStyle}>
      <RaisedBox>
        <MultiViz
          css={{
            height: 800
          }}
        >
          <TitledViz
            title="A sample bar chart"
            subtitle="A masterpiece in charting"
          >
            <Autosized>
              <ExampleBarChart
                dataList1={categoryList}
                xAxisTitleProp={'x axis'}
                yAxisTitleProp={'y axis'}
                mainTitleProp={'Main Title'}
                subTitleProp={'Subtitle'}
                legend={legend}
              />
            </Autosized>
          </TitledViz>
        </MultiViz>
      </RaisedBox>
    </div>
  ))
  .add('Area Chart with header and side-legend', () => (
    <div className={backgroundStyle}>
      <RaisedBox>
        <MultiViz
          css={{
            height: 800
          }}
        >
          <TitledViz
            title="A sample area chart"
            subtitle="A masterpiece in charting"
          >
            <Autosized>
              <ExampleAreaChart
                dataList1={areaList1}
                dataList2={areaList2}
                dataList3={areaList3}
                xAxisTitleProp={'x axis'}
                yAxisTitleProp={'y axis'}
                mainTitleProp={'Main Title'}
                subTitleProp={'Subtitle'}
                legend={legend}
              />
            </Autosized>
          </TitledViz>
          <VerticalLegend>
            {legend.map(({ color, title }) => (
              <LegendKey title={title} color={color} />
            ))}
          </VerticalLegend>
        </MultiViz>
      </RaisedBox>
    </div>
  ))
