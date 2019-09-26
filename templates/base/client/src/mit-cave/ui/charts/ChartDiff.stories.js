import { storiesOf } from '@storybook/react'
import React from 'react'
import { FullScreenContainer } from '../Layouts'
import { chart } from '../storyConsts'
import { chartDarkBlue, chartLightBlue, chartOrange } from '../theme'
import { ExampleLineChart } from './CaveChart.stories'
import { ChartDiff, DiffSideBySideLayout } from './ChartDiff'
import { Autosized } from './index'

const list1 = [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 15 }, { x: 4, y: 12 }]

const list2 = [{ x: 1, y: 10 }, { x: 2, y: 4 }, { x: 3, y: 2 }, { x: 4, y: 15 }]

const list3 = [{ x: 1, y: 7 }, { x: 2, y: 11 }, { x: 3, y: 9 }, { x: 4, y: 2 }]

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

storiesOf(chart('ChartDiff'), module).add('Default', () => (
  <div
    style={{
      width: '100vw',
      height: '100vh'
    }}
  >
    <FullScreenContainer>
      <DiffSideBySideLayout>
        <ChartDiff>
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
        </ChartDiff>
        <ChartDiff>
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
        </ChartDiff>
      </DiffSideBySideLayout>
    </FullScreenContainer>
  </div>
))
