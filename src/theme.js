import { createMuiTheme } from '@material-ui/core/styles'
import * as colors from '@material-ui/core/colors'
import felt from './assets/felt.png'

export default createMuiTheme({
  themeName: 'Blackjack',
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          background: `transparent url(${felt}) no-repeat center center fixed`,
          backgroundSize: 'cover',
        },
      },
    },
  },
  palette: {
    type: 'dark',
    primary: {
      contrastText: '#fff',
      main: colors.blueGrey[900],
    },
    secondary: {
      main: colors.pink[900],
    },
    info: {
      main: colors.blueGrey[400],
    },
    success: {
      main: colors.lightGreen[500],
    },
    error: {
      main: colors.red[800],
    },
    warning: {
      main: colors.deepOrange[800],
    },
  },
  typography: {
    body1: {
      fontFamily: 'Raleway, sans-serif',
      fontWeight: 600,
    },
    h1: {
      fontFamily: '"Diplomata SC", cursive',
    },
  },
})
