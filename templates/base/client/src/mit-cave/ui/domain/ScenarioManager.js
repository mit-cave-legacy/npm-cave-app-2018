import * as R from 'ramda'
import React from 'react'
import { css, cx } from 'react-emotion'
import { listClass, RadioListItem, Pad } from '../compound'
import {
  IconCancel,
  IconChevLeft,
  IconConfirm,
  IconDelete,
  IconPlus
} from '../icons'
import { px } from '../theme'
import { ExampleScenarioDetail } from './ExampleScenarioDetail'

/*
 * Generic scenario picker for convenience
 * Takes a list of scenarios (id,name) and makes them pickable
 * Scrolls item into view if off-screen
 * active = the current scenario in play
 * picked = opened in the list
 */
export class ScenarioList extends React.Component {
  componentDidMount() {
    this.scrollIntoView()
  }

  componentDidUpdate(oldProps) {
    if (oldProps.hide !== this.props.hide && !this.props.hide) {
      this.scrollIntoView()
    }
  }

  scrollIntoView() {
    const selectedItem = this.rootEl.querySelector('.cave-selected-item')
    if (selectedItem) {
      selectedItem.scrollIntoViewIfNeeded(true)
    }
  }

  render() {
    const { data, onSelect, onOpenDetail, value } = this.props
    const onClickHandler = id => () => onSelect(id)
    const onNavClickHandler = id => () => onOpenDetail(id)
    return (
      <div
        className={listClass}
        ref={el => {
          // console.log({ el })
          this.rootEl = el
        }}
      >
        {data.map(({ id, name, description }, idx) => (
          <RadioListItem
            key={id}
            nav={!!onOpenDetail}
            onNav={onNavClickHandler(id)}
            value={id}
            onSelect={onClickHandler(id)}
            title={name}
            isChecked={value === id}
            className={cx({ 'cave-selected-item': idx === data.length - 1 })}
          >
            <div>{description}</div>
          </RadioListItem>
        ))}
        <div
          css={{
            flex: 1
          }}
        />
      </div>
    )
  }
}

export const NEW_ID = '${$$NEW$$}$'

const getIconLeft = R.cond([
  [
    ({ expanded, adding }) => expanded && !adding,
    ({ onDelete, detailId }) => (
      <IconDelete onClick={() => onDelete(detailId)} />
    )
  ],
  [
    ({ expanded, adding }) => expanded && adding,
    ({ onSave, isNewScenarioInvalid }) => (
      <IconConfirm
        onClick={() => onSave()}
        disabled={isNewScenarioInvalid}
        css={{
          pointerEvents: isNewScenarioInvalid ? 'none' : 'inherit',
          opacity: isNewScenarioInvalid ? 0.5 : 1
        }}
      />
    )
  ],
  [R.T, ({ onAdd }) => <IconPlus onClick={onAdd} />]
])

/*
 * Scenario manager as a pure stateless component
 */
export class ScenarioManager extends React.PureComponent {
  render() {
    const {
      data,
      onSelect,
      onAdd,
      onDelete,
      onOpenDetail,
      onClose,
      onCloseDetail,
      onSave,
      detailId,
      value,
      hide,
      isNewScenarioInvalid,
      children,
      adding,
      ...props
    } = this.props
    const detailScenario = data.find(R.propEq('id', detailId))
    const detailScenarioName = R.propOr('-', 'name', detailScenario)
    const expanded = detailId != null
    const iconLeft = getIconLeft({
      expanded,
      adding,
      onAdd,
      onSave,
      isNewScenarioInvalid,
      onDelete,
      detailId
    })
    const iconRight = expanded ? (
      <IconChevLeft onClick={() => onCloseDetail(detailId)} />
    ) : (
      <IconCancel onClick={onClose} />
    )

    const child =
      React.Children.count(children) > 0 ? (
        React.Children.only(children)
      ) : (
        <ExampleScenarioDetail />
      )

    const detail = React.cloneElement(child, {
      adding: child.props.adding || adding,
      onSave: child.props.onSave || onSave,
      // className: css({
      // position: 'absolute',
      // top: 0,
      // zIndex: 8,
      // height: `calc(100% - ${px(32)})`
      // transition: 'transform 200ms',
      // transform: expanded ? '' : `translate3d(${500}px,0,0)`
      // }),
      scenario: detailScenario
    })

    return (
      <Pad
        selfMove={true}
        iconLeft={iconLeft}
        iconRight={iconRight}
        title={expanded ? detailScenarioName : 'Scenario Library'}
        hide={hide}
        {...props}
      >
        {!expanded ? (
          <ScenarioList
            // hide={hide}
            data={data}
            onAdd={onAdd}
            onSelect={onSelect}
            detailId={detailId}
            value={value}
            onOpenDetail={onOpenDetail}
          />
        ) : (
          detail
        )}
      </Pad>
    )
  }
}
