import { storiesOf } from '@storybook/react'
import * as R from 'ramda'
import React from 'react'
import { compound } from '../storyConsts'
import { Table, TableHeader, TableRow } from './Table'
import { RaisedBox, TitledViz } from './Viz'

const row = {
  student: 'Jerry',
  partner: 'Julianne',
  teacher: 'J. Crawford',
  revenue: 0.48,
  cost: 0.48,
  address: '1234 Elementary Ave.'
}
const rows = R.range(0, 10).map(id => ({ id, ...row }))

const PairTableRow = ({
  id,
  student,
  partner,
  teacher,
  revenue,
  cost,
  address
}) => (
  <TableRow columns={`1fr 1fr 1fr 2fr 1.5fr`}>
    <div>{student}</div>
    <div>{partner}</div>
    <div>{teacher}</div>
    <div>
      {revenue}, {cost}
    </div>
    <div>{address}</div>
  </TableRow>
)

storiesOf(compound('Table'), module).add('Default', () => (
  <div css={{ margin: 30 }}>
    <RaisedBox
      css={{
        width: 700
      }}
    >
      <TitledViz title="Test table">
        <Table>
          <TableHeader columns={`1fr 1fr 1fr 2fr 1.5fr`}>
            <div>Student</div>
            <div>Partner</div>
            <div>Teacher</div>
            <div>Revenue, Cost</div>
            <div>Address</div>
          </TableHeader>
          {rows.map(row => (
            <PairTableRow key={row.id} {...row} />
          ))}
        </Table>
      </TitledViz>
    </RaisedBox>
  </div>
))
