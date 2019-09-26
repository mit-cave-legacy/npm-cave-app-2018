import { defaultFont } from '../theme'

export const unstyleButton = {
  border: 'none',
  padding: 0,
  fontFamily: defaultFont,
  appearance: 'none',
  '&:focus': {
    outline: 'none'
  }
}
