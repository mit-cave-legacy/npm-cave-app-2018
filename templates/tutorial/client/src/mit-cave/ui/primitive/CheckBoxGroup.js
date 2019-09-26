import styled from 'react-emotion'
import { withFieldLabel } from './FieldLabel'

export const CheckBoxGroupBeforeLabel = styled('div')({
  display: 'flex',
  flexDirection: 'column'
})

export const CheckBoxGroup = withFieldLabel(
  'CheckboxGroup',
  CheckBoxGroupBeforeLabel
)
