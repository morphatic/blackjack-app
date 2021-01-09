import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from '../src/theme'

const MuiDecorator = storyFn => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {storyFn()}
  </MuiThemeProvider>
)

export const decorators = [
  MuiDecorator,
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}