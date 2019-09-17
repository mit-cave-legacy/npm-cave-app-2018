import { storiesOf } from '@storybook/react'
import * as R from 'ramda'
import { addIndex, map } from 'ramda'
import React from 'react'
import {
  IconAdd,
  IconChevRight,
  IconErase,
  IconLibrary,
  IconMap
} from '../icons'
import { Button } from '../primitive'
import { compound } from '../storyConsts'
import { px, radiantGraphite } from '../theme'
import { Pad } from './Pad'
import { RadialMenu, SingletonRadialMenu } from './RadialMenu'

const mapIndexed = addIndex(map)

const sites = [
  'codepen',
  'facebook',
  'google',
  'twitter',
  'dribbble',
  'linkedin',
  'github',
  'behance'
]

/*
 Render the component
 */

const buttonPositions = {
  a: {
    top: 200,
    left: 150
  },
  b: {
    top: 200,
    left: 250
  },
  c: {
    top: 200,
    left: 350
  }
}
const menuIcons2 = [
  <IconAdd />,
  <IconErase />,
  <IconLibrary />,
  <IconMap />,
  <IconChevRight />
]

class TriggerWithMenu extends React.Component {
  state = {
    activeButton: null
  }
  toggle = which => {
    console.log('toggle', which)
    this.setState({
      activeButton: which === this.state.activeButton ? null : which
    })
  }

  render() {
    const { activeButton } = this.state
    const { children } = this.props
    const makeButton = which => {
      const { top, left } = buttonPositions[which]
      return (
        <React.Fragment>
          <div
            css={{
              position: 'absolute',
              top,
              left,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Button
              className="trigger-button-special"
              isOpen={which === activeButton}
              onClick={() => this.toggle(which)}
            >
              {which.toUpperCase()}
            </Button>
          </div>
        </React.Fragment>
      )
    }
    const renderMenu = () => {
      const { top, left } = buttonPositions[activeButton] || {}
      const isOpen = !!activeButton
      const finalChildren =
        activeButton === 'c' ? R.slice(0, 2, children) : children
      return (
        <SingletonRadialMenu
          x={left}
          y={top}
          menuKey={activeButton}
          onClickaway={e => {
            if (e.target.closest('.trigger-button-special')) return
            this.setState({ activeButton: null })
          }}
          isOpen={isOpen}
        >
          {finalChildren}
        </SingletonRadialMenu>
      )
    }
    return (
      <div
        css={{
          position: 'relative',
          width: px(800),
          height: px(800),
          backgroundColor: radiantGraphite
        }}
      >
        {makeButton('a')}
        {makeButton('b')}
        {makeButton('c')}
        {renderMenu()}
      </div>
    )
  }
}

storiesOf(compound('RadialMenu'), module)
  .add('with letters', () => (
    <TriggerWithMenu>
      {map(
        icon => (
          <Button key={icon}>{icon[0]}</Button>
        ),
        sites
      )}
    </TriggerWithMenu>
  ))
  .add('with icons', () => (
    <TriggerWithMenu>
      <Button>
        <IconAdd />
      </Button>
      <Button>
        <IconErase />
      </Button>
      <Button>
        <IconLibrary />
      </Button>
      <Button>
        <IconMap />
      </Button>
      <Button>
        <IconChevRight />
      </Button>
    </TriggerWithMenu>
  ))
  .add('anchored', () => (
    <Pad selfMove>
      <div
        css={{
          position: 'absolute',
          top: '50%',
          left: '50%'
        }}
      >
        <RadialMenu isOpen>
          <Button>
            <IconAdd />
          </Button>
          <Button>
            ><IconErase />
          </Button>
        </RadialMenu>
      </div>
    </Pad>
  ))
