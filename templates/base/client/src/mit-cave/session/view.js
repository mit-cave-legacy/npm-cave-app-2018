import { component } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { css } from 'react-emotion'
import {
  BackgroundMap,
  BigAttribute,
  Button,
  CenteredInPage,
  FloatingPlainCaveHeader,
  Form,
  IconPlus,
  IconConfirm,
  IconCancel,
  Pad,
  px,
  RaisedBox,
  Table,
  TableHeader,
  TableRow,
  theme,
  Viz,
  VizHeader
} from '@mit-cave/ui'
import { coreEvent } from '@mit-cave/core'
import { routeEvent } from '@mit-cave/route'
import { createSub } from '@mit-cave/util'
import { sessionEvent } from './event'

const columns = `${px(190)} ${px(190)} ${px(190)} auto`

export const createViews = ({
  getClients,
  getDetailedSessions,
  getIsAddingSession,
  getSessionName
}) => {
  /**
   * A session that is being created
   */
  const SessionRow = component(
    'Session',
    { injectDispatch: true },
    ({ dispatch, id, scenarioName, connectionCount }) => (
      <TableRow className={css({ height: px(50) })} columns={columns}>
        <div>{id}</div>
        <div>{scenarioName ? scenarioName : '<none>'}</div>
        <div>{connectionCount || 0}</div>
        <Button
          onClick={() =>
            dispatch(routeEvent.NAV_TO, ['map', { sessionId: id }])
          }
        >
          Join
        </Button>
      </TableRow>
    )
  )

  /*
   * An add session dialog
   */
  const AddSessionDialog = component(
    'AddSessionDialog',
    createSub({
      getSessionName
    }),
    ({ sessionName, dispatch }) => (
      <Pad
        y={100}
        title="Create a session"
        autoInput
        liveInput
        iconLeft={
          <IconCancel
            onClick={() =>
              dispatch(coreEvent.CHANGE_VALUE, ['addingSession', false])
            }
          />
        }
        iconRight={
          <IconConfirm
            disabled={!sessionName}
            onClick={() => dispatch(sessionEvent.CREATE, sessionName)}
          />
        }
        className={css({
          ['&>*']: {
            minWidth: px(120)
          }
        })}
      >
        <Form>
          <BigAttribute
            label="Session name"
            type="keyboard"
            value={sessionName}
            onChange={value =>
              dispatch(coreEvent.CHANGE_VALUE, [
                ['addingSessionForm', 'name'],
                value
              ])
            }
          />
        </Form>
      </Pad>
    )
  )

  /*
   * List of active sessions
   */
  const Sessions = component(
    'Sessions',
    createSub({
      getClients,
      getDetailedSessions,
      isAddingSession: getIsAddingSession
    }),
    ({ dispatch, clients, sessionName, detailedSessions, isAddingSession }) => (
      <React.Fragment>
        <CenteredInPage>
          <div
            className={css({
              fontSize: px(48),
              fontWeight: theme.fontWeightBold,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: px(24)
            })}
          >
            Join a session
          </div>
          <RaisedBox
            className={css({
              width: px(720),
              height: px(500),
              maxHeight: px(800)
            })}
          >
            <Viz
              className={css({
                height: '100%' //will make sure the table scrolls this way
              })}
            >
              <VizHeader title="Sessions">
                <Button
                  alt
                  className={css({
                    fontSize: theme.fontSizeMedium,
                    fontWeight: theme.fontWeightSemiBold,
                    height: px(36)
                  })}
                  icon={<IconPlus size={12} />}
                  onClick={() =>
                    dispatch(coreEvent.CHANGE_VALUE, ['addingSession', true])
                  }
                >
                  Create a session
                </Button>
              </VizHeader>
              <Table>
                <TableHeader columns={columns}>
                  <div>Name</div>
                  <div>Scenario</div>
                  <div># Connections</div>
                </TableHeader>
                {R.map(
                  props => (
                    <SessionRow key={props.id} {...props} />
                  ),
                  detailedSessions
                )}
              </Table>
            </Viz>
          </RaisedBox>
        </CenteredInPage>
        {isAddingSession && (
          <CenteredInPage
            className={css({
              zIndex: 2
            })}
          >
            <AddSessionDialog />
          </CenteredInPage>
        )}
        <FloatingPlainCaveHeader />
        <BackgroundMap />
      </React.Fragment>
    )
  )
  return {
    Sessions,
    AddSessionDialog
  }
}
