import { Autosized, CaveChart, Viz, VizHeader } from 'mit-cave'
import { component } from 'framework-x'
import React from 'react'
import { Sankey } from 'react-vis'
import { createSub } from '../../common'
import { getEnergy } from '../../subs'

/*
 * Another example of a react-vis component.
 * Note that we recommend NOT putting margins within react-vis components, but let
 * the Sizetracker set it with the "padding" attribute to make sure all components
 * (react-vis and otherwise) have the same way to manage padding.
 */
export const EnergySankeyChartOnly = component(
  'EnergySankey',
  createSub({
    getEnergy
  }),
  ({ width, height, energy }) => (
    <CaveChart>
      <Sankey
        width={width}
        height={height}
        nodes={energy.nodes}
        links={energy.links}
        align="center"
        layout={24}
        nodeWidth={15}
        nodePadding={10}
        style={{
          links: {
            opacity: 0.3
          },
          labels: {
            fontSize: '8px'
          },
          rects: {
            strokeWidth: 2,
            stroke: '#1A3177'
          }
        }}
      />
    </CaveChart>
  )
)

export const EnergySankey = component(
  'EnergySankey',
  ({ name, description }) => (
    <Viz>
      <VizHeader title={name} subtitle={description} />
      <Autosized>
        <EnergySankeyChartOnly />
      </Autosized>
    </Viz>
  )
)
