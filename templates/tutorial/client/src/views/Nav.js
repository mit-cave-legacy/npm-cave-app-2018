import {
  CaveLogo,
  FloatingHeader,
  LowerLeft,
  NavigationTab,
  px,
  RaisedBox,
  TabSelector,
  routeEvent
} from 'mit-cave'
import { component } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { css } from 'react-emotion'
import { createSub } from '../common'
import { routeIds } from '../routes'
import { getRouteArgs, getRouteId } from '../features'
import { getOverallLayout } from '../subs'


export const FlatNavInner = component(
  'FlatNavInner',
  createSub({
    getRouteId,
    getRouteArgs,
    isDashboardSelectorOpen: R.propOr(false, 'dashboardSelectorOpen')
  }),
  ({ vert, dispatch, routeId, routeArgs }) => (
    <TabSelector
      className={css({
        '>*': {
          minHeight: !vert ? px(46) : 0
        }
      })}
      vertical={vert}
      value={[routeId, R.dissoc('sessionId', routeArgs)]}
      onSelect={([targetId, targetArgs = {}]) => {
        const finalArgs = R.merge(routeArgs, targetArgs)
        if (targetId === routeId && R.equals(finalArgs, routeArgs)) return
        dispatch(routeEvent.NAV_TO, [targetId, finalArgs])
      }}
    >
      <NavigationTab value={[routeIds.MAP, {}]}>Map</NavigationTab>
      <NavigationTab value={[routeIds.DASHBOARD, { dashboardId: 'stores' }]}>
        Stores by State
      </NavigationTab>
    </TabSelector>
  )
)

export const BottomStrictNav = component('BottomStrictNav', ({ visible }) => (
  <LowerLeft
    className={css({
      label: 'bottom-strict-nav',
      display: visible ? 'flex' : 'none',
      position: 'absolute',
      zIndex: 3,
      // bottom: 16,
      // left: 0,
      left: px(16)
    })}
  >
    <RaisedBox
      className={css({
        paddingLeft: px(16),
        paddingRight: px(16)
      })}
    >
      <FlatNavInner />
    </RaisedBox>
  </LowerLeft>
))

export const BottomNav = component('BottomNav', ({ visible }) => (
  <LowerLeft
    className={css({
      label: 'bottom-strict-nav',
      display: visible ? 'flex' : 'none',
      position: 'absolute',
      zIndex: 3,
      // bottom: 16,
      // left: 0,
      left: px(16)
    })}
  >
    <RaisedBox
      className={css({
        paddingLeft: px(16),
        paddingRight: px(16)
      })}
    >
      <FlatNavInner vert />
    </RaisedBox>
  </LowerLeft>
))

export const TopNav = component(
  'TopNav',
  createSub({}),
  ({ dispatch, visible }) => (
    <FloatingHeader
      className={css({
        display: visible ? 'flex' : 'none'
      })}
    >
      <CaveLogo
        className={css({
          cursor: 'pointer',
          marginRight: px(40)
        })}
        onClick={() => dispatch(routeEvent.NAV_TO, [routeIds.SESSIONS])}
      />
      <FlatNavInner />
    </FloatingHeader>
  )
)

export const FlatNav = component(
  'FlatNav',
  createSub({ getOverallLayout }),
  ({ visible, overallLayout }) => {
    switch (overallLayout) {
      case 'top':
        return <TopNav visible={visible} />
      case 'bottom':
        return <BottomNav visible={visible} />
      default:
        return <BottomStrictNav visible={visible} />
    }
  }
)
