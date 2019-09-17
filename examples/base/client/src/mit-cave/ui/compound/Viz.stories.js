import { storiesOf } from '@storybook/react'
import React from 'react'
import { compound } from '../storyConsts'
import { standardBorder } from '../theme'
import { HeadlessTitledViz, MultiViz, RaisedBox, TitledViz, Viz } from './Viz'

storiesOf(compound('Viz'), module)
  .add('with table', () => (
    <div css={{ paddingLeft: 40, paddingTop: 40 }}>
      <RaisedBox
        css={{
          width: 600
        }}
      >
        <TitledViz
          title="Main visualization title"
          subtitle="a subtitle for extra information"
        >
          <div css={{ height: 500, border: standardBorder }}>
            table goes here
          </div>
        </TitledViz>
      </RaisedBox>
    </div>
  ))
  .add('with chart', () => (
    <div css={{ paddingLeft: 40, paddingTop: 40 }}>
      <RaisedBox
        css={{
          width: 600
        }}
      >
        <TitledViz
          title="Main chart title"
          subtitle="a subtitle for extra information"
        >
          <div
            className="cave-chart"
            css={{ height: 500, border: standardBorder }}
          >
            chart goes here
          </div>
        </TitledViz>
      </RaisedBox>
    </div>
  ))
  .add('multiviz with chart and legend', () => (
    <div css={{ paddingLeft: 40, paddingTop: 40 }}>
      <RaisedBox>
        <MultiViz
          css={{
            width: 900
          }}
        >
          <TitledViz
            title="Multi viz chart title"
            subtitle="a subtitle for extra information"
          >
            <div
              className="cave-chart"
              css={{ height: 500, border: standardBorder }}
            >
              chart goes here
            </div>
          </TitledViz>
          <div
            css={{
              width: 120,
              textAlign: 'center'
            }}
          >
            Legend goes here
          </div>
        </MultiViz>
      </RaisedBox>
    </div>
  ))
  .add('multiviz with chart and legend and table', () => (
    <div css={{ paddingLeft: 40, paddingTop: 40 }}>
      <RaisedBox>
        <MultiViz
          css={{
            width: 900
          }}
        >
          <TitledViz
            title="Multi viz chart title"
            subtitle="a subtitle for extra information"
          >
            <div
              className="cave-chart"
              css={{ height: 500, border: standardBorder }}
            >
              chart goes here
            </div>
          </TitledViz>
          <div
            css={{
              width: 120,
              textAlign: 'center'
            }}
          >
            Legend goes here
          </div>
          <TitledViz title="A table" subtitle="a very cool table">
            Some table stuff goes here...
          </TitledViz>
        </MultiViz>
      </RaisedBox>
    </div>
  ))
