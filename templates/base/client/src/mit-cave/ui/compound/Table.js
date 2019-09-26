import React from 'react'
import styled from 'react-emotion'
import {
  greyBlue,
  px,
  radiantGraphite,
  standardBorder,
  standardBorderRounding
} from '../theme'
import { List } from './List'

export const TableContainer = styled('div')(() => ({
  borderRadius: standardBorderRounding,
  backgroundColor: radiantGraphite
}))

export const Table = List

/**
 * TableRow
 * @type {StyledOtherComponent<{columns?: *}, JSX.IntrinsicElements[[string]], Theme>}
 */
export const TableRow = styled('div')(({ columns }) => ({
  height: px(40),
  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: columns,
  paddingLeft: px(24),
  paddingRight: px(24),
  '&>*': {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  borderBottom: standardBorder
}))

export const TableHeader = styled(TableRow)({
  backgroundColor: greyBlue
})
