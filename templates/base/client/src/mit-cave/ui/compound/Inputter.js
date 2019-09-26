import * as R from 'ramda'
import React from 'react'
import styled from 'react-emotion'
import { withProps } from 'recompose'
import { IconCancel, IconConfirm, IconRevert } from '../icons'
import { Button } from '../primitive'
import { cancel, confirm, px, standardBorder } from '../theme'
import { Keyboard } from './Keyboard'
import { Numpad } from './Numpad'

const ColumnButton = withProps({ alt: true })(
  styled(Button)({
    borderRadius: '50%'
  })
)

export const ConfirmCancelSeparator = ({
  onLeft,
  value,
  liveInput,
  getIsValid,
  onConfirm,
  onCancel,
  isRevertable,
  onRevert
}) => {
  return (
    <div
      css={{
        // width: px(10),
        alignSelf: ' stretch',
        // background: 'red',
        marginTop: px(20),
        marginBottom: px(20),
        // marginLeft: px(37),
        borderRight: onLeft ? standardBorder : 'none',
        borderLeft: onLeft ? 'none' : standardBorder,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        '&>:not(:first-child)': {
          marginTop: px(liveInput ? 0 : 40)
        },
        '&>*': {
          transform: `translate(${onLeft ? '' : '-'}50%,0)`
        }
      }}
    >
      {!liveInput && (
        <ColumnButton
          onClick={() => onConfirm(value)}
          disabled={!getIsValid(value)}
        >
          <IconConfirm color={confirm} size={px(12)} />
        </ColumnButton>
      )}
      <ColumnButton onClick={() => onCancel()}>
        <IconCancel color={cancel} size={px(12)} />
      </ColumnButton>
      {
        isRevertable &&
        <ColumnButton onClick={onRevert}>
          <IconRevert size={px(12)} />
        </ColumnButton>
      }
    </div>
  )
}

const getActualInput = ({ type, value, onConfirm, onChange }) => {
  if (type.isReactComponent) return type
  switch (type) {
    case 'keyboard':
      return (
        <Keyboard
          onClickEnter={() => onConfirm(value)}
          onChange={onChange}
          value={value}
        />
      )
    case 'numpad':
      return <Numpad onChange={onChange} value={value} />
    default:
      return null
  }
}

/**
 * A multi-input for use with the pad that can provide soft keyboard, numpad, or chooser
 * When a @attribute type is provided, it displays that input type plus a confirm/reject
 * separator.
 *
 * onLeft
 * type
 * fieldName
 * getIsValid
 * onConfirm
 * onCancel
 */

export class ConfirmInputter extends React.Component {
  state = {
    fieldName: '!@#$!!zdf'
  }

  static getDerivedStateFromProps(props, state) {
    /* Reset initial value when fieldName changes */
    if (state.fieldName !== props.fieldName || props.isOpen !== state.isOpen) {
      return {
        isOpen: props.isOpen,
        initialValue: props.initialValue,
        value: props.initialValue,
        fieldName: props.fieldName
      }
    }
    return null
  }

  onChange = value => {
    this.setState({ value })
  }

  render() {
    const {
      onLeft,
      type,
      getIsValid = R.always(true),
      options = [],
      isRevertable,
      onConfirm = () => {},
      onCancel = () => {},
      onRevert = () => {},
      multiSelect = false
    } = this.props

    // type indicates that that type of input should be open

    if (!type) return null // not open
    const { value } = this.state

    const inputMode = getActualInput({
      type,
      onConfirm,
      value,
      onChange: this.onChange
    })

    return (
      <div
        className="cave-inputter"
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: px(20)
        }}
      >
        {inputMode ? (
          <React.Fragment>
            {onLeft && inputMode}
            <ConfirmCancelSeparator
              onLeft={onLeft}
              value={value}
              getIsValid={getIsValid}
              onConfirm={onConfirm}
              onCancel={onCancel}
              onRevert={onRevert}
              isRevertable={isRevertable}
            />
            {!onLeft && inputMode}
          </React.Fragment>
        ) : null}
      </div>
    )
  }
}

/**
 * Multi-type-inputter that is stateless and just live updates
 */
export class LiveInputter extends React.PureComponent {
  render() {
    const {
      value,
      onLeft,
      type,
      getIsValid = R.always(true),
      options = [],
      isRevertable,
      onCancel = () => {},
      onRevert = () => {},
      onChange,
      multiSelect = false
    } = this.props

    const onConfirm = this.props.onConfirm || onCancel

    if (!type) return null // not open

    const finalOnChange = val => {
      onChange(val)
    }
    const inputMode = getActualInput({
      type,
      value,
      onConfirm,
      onChange: finalOnChange
    })

    return (
      <div
        className="cave-inputter"
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: px(20)
        }}
      >
        {inputMode ? (
          <React.Fragment>
            {onLeft && inputMode}
            <ConfirmCancelSeparator
              onLeft={onLeft}
              value={value}
              getIsValid={getIsValid}
              onCancel={onCancel}
              isRevertable={isRevertable}
              onRevert={onRevert}
              liveInput={true}
            />
            {!onLeft && inputMode}
          </React.Fragment>
        ) : null}
      </div>
    )
  }
}
