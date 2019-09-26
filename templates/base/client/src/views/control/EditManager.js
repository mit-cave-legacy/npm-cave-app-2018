import {
  Button,
  Form,
  IconDelta,
  IconMapMarker,
  IconRevert,
  IconUndo,
  IconRedo,
  Pad,
  px,
  theme,
  coreEvent,
  scenarioEvent
} from 'mit-cave'
import { component } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import styled, { cx, css } from 'react-emotion'
import { createSub } from '../../common'
import { appEvent } from '../../common/appEvent'
import {
  getPad,
  getVisibleUndoList,
  withWiredPadProps
} from '../../features'

const PAD_ID = 'editManager'

const outerEditCls = css({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 12,
  paddingRight: 12,
  border: theme.standardBorder,
  borderRadius: theme.standardBorderRounding,
  marginBottom: 8,
  height: 32,
  justifyContent: 'space-between',
  fontSize: theme.fontSizeSmall
})
const innerEditCls = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1
})

const NodeId = styled('div')({
  background: theme.mediumGrey,
  borderRadius: theme.standardBorderRounding,
  height: 20,
  lineHeight: '20px',
  paddingLeft: 6,
  paddingRight: 6
})

const chunkCls = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const ChangeSummary = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&>:first-child': {
    marginRight: 6
  }
})

const cleanValue = value => (value == null ? '<null>' : value.toString())

const ChangeNodeValue = ({ payload: [nodeId, path, value] }) => (
  <div className={innerEditCls}>
    <ChangeSummary>
      <IconDelta
        size={12}
      />
      <div>
        {path}={cleanValue(value)}
      </div>
    </ChangeSummary>
    <div className={chunkCls}>
      <NodeId>{nodeId}</NodeId>
      <IconMapMarker
        className={css({
          marginTop: 5,
          marginLeft: 6
        })}
        size={24}
        color={'red'}
      />
    </div>
  </div>
)

const ChangeScenarioValue = ({ payload: [path, value] }) => (
  <div className={innerEditCls}>
    <div>
      {path}={cleanValue(value)}
    </div>
    <div>Scenario</div>
  </div>
)

const RevertNode = ({ payload: nodeIds }) => (
  <div className={innerEditCls}>
    <ChangeSummary>
      <IconRevert size={12} />
      Reset {nodeIds.length} {nodeIds.length === 1 ? 'node' : 'nodes'}
    </ChangeSummary>
    {nodeIds.length === 1
     ? <IconMapMarker />
     : <div
       className={css({
         paddingTop: 9,
         marginRight: -10,
         '&>*': {
           marginLeft: -15
         }
       })}
     >
       <IconMapMarker />
       <IconMapMarker />
       <IconMapMarker />
     </div>

    }

  </div>
)

const renderEdit = (type, payload) => {
  switch (type) {
    case scenarioEvent.CHANGE_NODE_VALUE:
      return <ChangeNodeValue type={type} payload={payload} />
    case scenarioEvent.CHANGE_SCENARIO_VALUE:
      return <ChangeScenarioValue type={type} payload={payload} />
    case scenarioEvent.RESET_NODES:
      return <RevertNode type={type} payload={payload} />
    default:
      return <div>(an edit)</div>
  }
}

export const Edit = ({
  tx: [sid, timestamp, mutationType, mutationPayload, channel, meta]
}) => {
  /* get original edit type */
  if (!meta) {
    console.log(mutationType, mutationPayload)
    return <div>? {mutationType}</div>
  }
  const [type, payload] = meta
  const innerEdit = renderEdit(type, payload)
  return (
    <div className={outerEditCls}>
      {/*<div>{distanceInWordsToNow(timestamp)}</div>*/}
      {innerEdit}
    </div>
  )
}

export const Diff = ({ dispatch, id, diff, isActive }) => {
  return (
    <div
      className={css({
        borderRadius: theme.standardBorderRounding,
        fontSize: theme.fontSizeSmall,
        cursor: 'pointer',
        border: isActive
                ? `${px(1)} solid ${theme.lightBlue}`
                : `${px(1)} solid ${theme.greyBlue}`
      })}
      onClick={() => {
        dispatch(appEvent.OPEN_DIFF_PAD, id)
      }}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          borderBottom: theme.standardBorder,
          paddingLeft: 6,
          height: 38
        })}
      >
        <IconMapMarker
          className={css({
            marginTop: 5,
            marginLeft: 6
          })}
          size={24}
          color={'red'}
        />
        <NodeId>{id}</NodeId>
      </div>
      <div
        className={css({
          padding: 10
        })}
      >
        {R.pipe(
          R.toPairs,
          R.map(([key, value]) => (
            <div
              key={key}
              className={css({
                padding: 4
              })}
            >
              <div>
                {key} = {value != null && value.toString()}
              </div>
            </div>
          ))
        )(diff)}
      </div>
    </div>
  )
}

const DiffViewer = ({ dispatch, entityEdits, selectedNodeMap }) => (
  <Form>
    {R.map(
      ([id, edit]) => (
        <Diff
          dispatch={dispatch}
          key={id}
          id={id}
          diff={edit}
          isActive={selectedNodeMap[id]}
        />
      ),
      R.toPairs(entityEdits)
    )}

  </Form>
)

const EditList = component(
  'EditList',
  createSub({
    undoList: getVisibleUndoList
  }),
  ({ undoList }) => (
    <Form>
      {undoList.map(tx => (
        <Edit key={tx[0]} tx={tx} />
      ))}
    </Form>
  )
)

const iconButtonCls = css({
  height: 28,
  width: 28,
  maxWidth: 28,
  padding: 0
})

const IconButton = ({ children, className, ...props }) => (
  <Button className={cx(iconButtonCls, className)} {...props}>
    {React.cloneElement(React.Children.only(children), {
      color: props.disabled ? theme.mediumGrey : children.props.color
    })}
  </Button>
)


const Switcher = ({ page, selectedEditIds, undoList, undoPlayhead, dispatch }) => (
  <div
    className={css({
      height: 52,
      position: 'absolute',
      zIndex: 1000,
      top: 405,
      left: 0,
      width: 358,
      borderTop: theme.standardBorder,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 16,
      paddingRight: 16
    })}
  >
    <div
      className={css({
        display: 'flex',
        alignItems: 'center'
      })}
    >
      {page === 'diff' &&
       <IconButton
         disabled={selectedEditIds.length === 0}
         onClick={() => dispatch(scenarioEvent.RESET_NODES, selectedEditIds)}
       >
         <IconRevert
           size={16}
         />
       </IconButton>
      }
      {page === 'undo' &&
       <React.Fragment>
         <IconButton
           className={css({
             marginRight: 8
           })}
           onClick={() => dispatch(scenarioEvent.UNDO)}
           disabled={undoPlayhead === 0}
         >
           <IconUndo size={16} />
         </IconButton>
         <IconButton
           onClick={() => dispatch(scenarioEvent.REDO)}
           disabled={undoPlayhead + 1 === undoList.length}
         >
           <IconRedo size={16} />
         </IconButton>
       </React.Fragment>
      }
    </div>
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        '&>*': {
          borderRadius: '200px!important',
          height: '28px!important',
          width: 115
        },
        '&>*:first-child': {
          marginRight: 11
        }
      })}
    >
      <Button
        selected={page === 'undo'}
        onClick={() => dispatch(coreEvent.CHANGE_VALUE, ['editManagerPage', 'undo'])}
      >
        Edit Log
      </Button>
      <Button
        selected={page === 'diff'}
        onClick={() => dispatch(coreEvent.CHANGE_VALUE, ['editManagerPage', 'diff'])}
      >
        Diffs
      </Button>
    </div>
  </div>
)

export const EditManager = component(
  'EditManager',
  createSub({
    pad: getPad(PAD_ID),
    page: R.propOr('diff', 'editManagerPage')
  }),
  ({ page, pad }) => {
    return (
      <Pad
        {...withWiredPadProps({ pad, padId: PAD_ID, defaultX: 100 })}
        title={`Edit Manager`}
        size="tall"
      >
        <div id="edit-manager" className={css({
          maxHeight: 404,
          '&>*': {
            maxHeight: 404
          }
        })}>
          {page === 'undo' && <EditList />}
          {page === 'diff' && <DiffViewer />}
        </div>
        <Switcher />
      </Pad>
    )
  }
)
