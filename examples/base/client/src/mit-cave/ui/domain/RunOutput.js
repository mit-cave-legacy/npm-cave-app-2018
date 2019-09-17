import * as R from 'ramda'
import React from 'react'
import styled, { css, cx } from 'react-emotion'
import { List, Pad } from '../compound'
import { IconCancel, IconCancelAlt, IconPointRight } from '../icons'
import {
  fontSizeSmall,
  fontWeightBold,
  mediumGrey,
  offWhite,
  px,
  radiantGraphite
} from '../theme'

const ConsoleLine = styled('div')({
  label: 'cave-console-line',
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: fontSizeSmall,
  color: offWhite,
  flex: 1
})

const LineNumber = styled('div')({
  label: 'cave-console-line-number',
  fontSize: fontSizeSmall,
  fontWeight: fontWeightBold,
  width: px(27),
  minWidth: px(27),
  color: mediumGrey
})

const Line = styled('div')({
  display: 'flex'
})

const RunOutputConsole = ({ lines, onScroll, ...props }) => (
  <List
    className="cave-console-list"
    css={{
      height: '100%',
      paddingTop: 16,
      paddingLeft: 24,
      paddingRight: 24,
      overflow: 'auto',
      backgroundColor: radiantGraphite,
      color: offWhite,
      '&>:not(:last-child)': {
        marginBottom: px(12)
      },
      ...css
    }}
    {...props}
  >
    {lines.map((line, index) => (
      <Line
        key={index}
        className={index === lines.length - 1 ? 'cave-last-console-line' : ''}
      >
        <LineNumber>{`${index + 1}.  `}</LineNumber>
        <ConsoleLine>{line}</ConsoleLine>
      </Line>
    ))}
  </List>
)

export class RunOutput extends React.Component {
  state = {
    scrollLock: true
  }

  componentDidMount() {
    const scrollEl = this.rootEl.querySelector('.cave-console-list')
    scrollEl.addEventListener('scroll', e => {
      const atBottom =
        scrollEl.scrollTop + scrollEl.offsetHeight === scrollEl.scrollHeight
      if (this.state.scrollLock && !atBottom) {
        this.setState({
          scrollLock: false
        })
      }
      if (!this.state.scrollLock && atBottom) {
        this.setState({
          scrollLock: true
        })
      }
    })
  }

  componentDidUpdate(oldProps) {
    const { lines } = this.props
    if (!this.state.scrollLock) return
    if (!R.equals(oldProps.lines, lines)) {
      // line change!
      // console.log('line change!')
      // scroll to behavior...
      const lastLine = this.rootEl.querySelector('.cave-last-console-line')
      if (lastLine) {
        lastLine.scrollIntoViewIfNeeded()
      }
    }
  }

  render() {
    const {
      className,
      lines,
      onClose,
      isRunning,
      onCancel,
      onRun,
      title = 'Run Output',
      ...props
    } = this.props
    return (
      <Pad
        size="wide"
        innerRef={el => (this.rootEl = el)}
        className={cx(
          css({
            width: px(480),
            height: px(360)
          }),
          className
        )}
        title={title}
        iconLeft={
          isRunning ? (
            <IconCancelAlt onClick={() => onCancel()} />
          ) : (
            <IconPointRight onClick={() => onRun()} />
          )
        }
        iconRight={<IconCancel onClick={() => onClose()} />}
        {...props}
      >
        <RunOutputConsole lines={lines} onScroll={e => console.log(e)} />
      </Pad>
    )
  }
}

{
  /* <div */
}
{
  /* css={{ */
}
{
  /* height: `calc(100% - ${px(40 + 24)})`, */
}
{
  /* '&>:first-child': { */
}
{
  /* flex: 1, */
}
{
  /* } */
}
{
  /* }} */
}
{
  /* > */
}
{
  /* <RunOutputConsole */
}
{
  /* lines={lines} */
}
{
  /* onScroll={e => console.log(e)} */
}
{
  /* /> */
}
{
  /* <div */
}
{
  /* css={{paddingTop: px(12), paddingBottom: px(12)}} */
}
{
  /* > */
}
{
  /* <Button alt>Run</Button> */
}
{
  /* </div> */
}
{
  /* </div> */
}
