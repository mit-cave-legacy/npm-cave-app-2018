import { storiesOf } from '@storybook/react'
/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { css } from 'react-emotion'
import { IconCancel } from '../icons'
import { compound } from '../storyConsts'
import { offWhite } from '../theme'
import { Pad } from './Pad'

const backgroundStyle = css({
  backgroundColor: offWhite,
  width: '100vw',
  height: '100vh'
})

class DragContainer extends React.Component {
  state = {
    x: 20,
    y: 20
  }
  onDrag = ({ x: x1, y: y1 }) => {
    this.setState({
      x: x1,
      y: y1
    })
  }

  render() {
    const { x, y } = this.state
    const { selfMove } = this.props
    const onDragMove = selfMove ? () => {} : this.onDrag
    const onDragEnd = selfMove ? this.onDrag : () => {}
    return (
      <div css={backgroundStyle}>
        <Pad
          x={x}
          y={y}
          selfMove={selfMove}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          iconRight={<IconCancel />}
          title="Scenario Library"
          // dragBar={
          //   <DragBar
          //     iconLeft={<IconPlus />}
          //     iconRight={<IconCancel />}
          //   >
          //
          //     Scenario Library
          //   </DragBar>
          // }
        >
          <div>The rest of the content goes here!!!!</div>
        </Pad>
      </div>
    )
  }
}

storiesOf(compound('Pad'), module)
  .add('external-move-props', () => <DragContainer />)
  .add('self-move', () => <DragContainer selfMove={true} />)
