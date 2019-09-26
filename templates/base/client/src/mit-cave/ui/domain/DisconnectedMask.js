import { Div } from 'glamorous'
import React from 'react'

export const DisconnectedMask = () => (
  <Div
    css={{
      position: 'absolute',
      zIndex: 100,
      backgroundColor: 'rgba(0,0,0,.4)',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 50,
      color: 'white',
      top: 0,
      left: 0
    }}
  >
    Disconnected from server
  </Div>
)
