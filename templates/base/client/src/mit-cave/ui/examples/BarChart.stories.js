import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis'
import { CaveChart } from '../charts'
import { RaisedBox, Viz } from '../compound'
import { FullScreenContainer } from '../Layouts'
import { kitchenSink } from '../storyConsts'
import { chartLightBlue, chartOrange, greyBlue } from '../theme'

const list1 = [{ x: 'A', y: 10 }, { x: 'B', y: 5 }, { x: 'C', y: 15 }]

const list2 = [{ x: 'A', y: 12 }, { x: 'B', y: 2 }, { x: 'C', y: 11 }]

/**
 * Example BarChart
 */
export class BarChart extends React.PureComponent {
  render() {
    return (
      <Viz title={'Main Title'} subtitle={'Subtitle'}>
        <CaveChart>
          <XYPlot xType="ordinal" width={560} height={312} xDistance={100}>
            <HorizontalGridLines style={{ stroke: greyBlue }} />
            <VerticalGridLines style={{ stroke: 'none' }} />
            <VerticalBarSeries
              className="vertical-bar-series-example"
              data={list1}
              style={{ stroke: chartLightBlue, fill: chartLightBlue }}
            />
            <VerticalBarSeries
              data={list2}
              style={{ stroke: chartOrange, fill: chartOrange }}
            />
            <XAxis title="X-axis" />
            <YAxis title="Y-axis" />
          </XYPlot>
        </CaveChart>
      </Viz>
    )
  }
}

storiesOf(kitchenSink('Bar Chart'), module).add('default', () => (
  <FullScreenContainer>
    <RaisedBox>
      <BarChart />
    </RaisedBox>
  </FullScreenContainer>
))
