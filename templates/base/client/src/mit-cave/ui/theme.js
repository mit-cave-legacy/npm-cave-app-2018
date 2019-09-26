export const greyBlue = '#39404C'
export const radiantGraphite = '#1C1E24'
export const lightBlue = '#105EE7' // STORE
export const darkGrey = '#121317'
export const darkBlue = '#0D47AC'
export const mediumGrey = '#5C687C'
export const lightGrey = '#707070'
export const offWhite = '#EDEDED'
export const confirm = '#1EDD6A'
export const cancel = '#E42828'
export const brightBlue = '#1094E7'
export const offYellow = '#C9A738' // DC
export const offRed = '#CE5731' // SUPPLIER

const getScale = () => {
  return 1
  const s = window.screen.availWidth
  // HD to 5K
  if (s < 2600) return 1
  // Hypothethical large display
  if (s < 5500) return 2
  // WALL (7000 x 3000)
  return 4
}
let scale = getScale()
export const getPxScale = () => scale
export const pxScale = () => `scale(${getPxScale()})`
export const pxNum = x => scale * x
export const px = x => (scale * x).toFixed(2) + 'px'
export const important = x => `${x}!important`

/* chart style */
export const chartLightBlue = '#18CDD7'
export const chartOrange = '#FF9920'
export const chartDarkBlue = '#223D90'

/* font heights */
export const fontSizeVerySmall = px(11)
export const fontSizeSmall = px(13)
export const fontSizeMedium = px(15)
export const fontSizeLarge = px(17)
export const fontSizeVeryLarge = px(28)
export const fontSizeHuge = px(48)

/* font weights */
export const fontWeightLight = 300
export const fontWeightRegular = 400
export const fontWeightMedium = 500
export const fontWeightSemiBold = 600
export const fontWeightBold = 700

export const defaultFont = '"HK Grotesk"'

/* compound properties */
export const standardBorder = `${px(1)} solid ${greyBlue}`
export const focusedBorder = `${px(1)} solid ${lightBlue}`
// export const focusedBoxShadow = '0px 0px 14px 0px rgba(16,94,231,0.4)'
export const standardBoxShadow = `0 13px 16px 0 rgba(0,0,0,.36)`

/* standard thicknesses / roundness */
export const standardBorderRounding = 24

/* semantic names. USE WHENEVER POSSIBLE */
export const borderColor = greyBlue

/* CATEGORICAL COLORS from react-vis */
export const categoricalColors = [
  '#19CDD7',
  '#DDB27C',
  '#88572C',
  '#FF991F',
  '#F15C17',
  '#223F9A',
  '#DA70BF',
  '#125C77',
  '#4DC19C',
  '#776E57',
  '#12939A',
  '#17B8BE',
  '#F6D18A',
  '#B7885E',
  '#FFCB99',
  '#F89570',
  '#829AE3',
  '#E79FD5',
  '#1E96BE',
  '#89DAC1',
  '#B3AD9E'
]
