import { Path } from 'glamorous'
import React from 'react'

import { SvgIcon } from './SvgIcon'

export const IconConfirm = ({ color = '#fff', ...props }) => (
  <SvgIcon viewBox="0 0 24 24" {...{ color, ...props }}>
    <Path
      css={{ transform: 'translate(0px, 2px)' }}
      d="M23.885,2.654A.886.886,0,0,1,24,3a.886.886,0,0,1-.115.346L9.519,21.808q-.346.346-.519.346a.831.831,0,0,1-.577-.288L.288,14.019l-.173-.173A.886.886,0,0,1,0,13.5a1.012,1.012,0,0,1,.115-.288L.231,13.1q1.615-1.731,2.538-2.654.346-.346.462-.346a.945.945,0,0,1,.577.346l4.615,4.5L19.962.115A.47.47,0,0,1,20.308,0a.93.93,0,0,1,.4.115Z"
    />
  </SvgIcon>
)

export default IconConfirm
