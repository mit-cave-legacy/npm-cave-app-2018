import React from 'react'
import { css } from 'react-emotion'
import { DrawingBackgroundMap } from '../icons/DrawingBackgroundMap'
import { px } from '../theme'

export const BackgroundMap = () => (
  <DrawingBackgroundMap
    preserveAspectRatio="none"
    className={css({
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      paddingTop: px(153)
    })}
  />
)
