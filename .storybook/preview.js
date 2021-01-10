import { I18nextProvider } from 'react-i18next'
import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import i18n from '../src/i18n'
import theme from '../src/theme'

export const globalTypes = {
  locale: {
    name: 'Locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        {
          value: 'en',
          title: 'English',
        },
        {
          value: 'jp',
          title: '日本語 (Japanese)',
        },
      ],
    },
  },
}

const I18nextDecorator = (storyFn, { globals }) => {
  i18n.changeLanguage(globals.locale)
  return (
    <I18nextProvider i18n={i18n}>
      {storyFn()}
    </I18nextProvider>
  )
}

const MuiDecorator = storyFn => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {storyFn()}
  </MuiThemeProvider>
)

export const decorators = [
  I18nextDecorator,
  MuiDecorator,
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}