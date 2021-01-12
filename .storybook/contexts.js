import { AuthStateContext } from '../src/contexts/AuthContext'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from '../src/theme'
const player = {
  _id: '5ffbf2c683d9735d844dbcc2',
  email: 'morgan.benton@gmail.com',
  name: '',
  chips: 100,
  history: [],
  preferences: {
    rules: {
      seats: 5,
      decks: 6,
      minBet: 5,
      maxBet: 2000,
      betIncrement: 5,
      allowEarlySurrender: false,
      allowLateSurrender: false,
      allowableDoubleDownTotals: [9,10,11],
      numberOfSplitsAllowed: 3,
      allowSplitsForAll10Cards: true,
      allowDoublingAfterSplit: true,
      payoutForBlackjack: 1.5,
      dealPlayersCardsFaceDown: false,
      dealerStandsOnSoft17: true,
      fiveCardCharlieWins: false,
      insuranceAvailable: true,
      secondsAllowedPerAction: 30,
    },
    deckColor: 'red',
    playWithRobots: false,
  },
  createdAt: '2021-01-11T06:40:06.062Z',
  updatedAt: '2021-01-11T18:44:35.401Z',
  isLoggedIn: true,
}

export const contexts = [
  {
    icon: 'paintbrush',
    title: 'Theme',
    components: [
      ThemeProvider,
    ],
    params: [
      {
        name: 'Default Theme',
        props: {
          theme,
        },
      },
    ],
  },
  {
    icon: 'key',
    title: 'Auth',
    components: [
      AuthStateContext.Provider,
    ],
    params: [
      {
        name: 'Logged Out',
        props: {
          value: {
            user: {
              did: null,
              isLoggedIn: false,
              player: null,
            },
          },
        },
        default: true,
      },
      {
        name: 'First Login',
        props: {
          value: {
            user: {
              did: '12345',
              isLoggedIn: true,
              player: player,
            },
          },
        },
      },
      {
        name: 'Logged In',
        props: {
          value: {
            user: {
              did: '12345',
              isLoggedIn: true,
              player: { ...player, name: 'Morgan'},
            },
          },
        },
      },
    ],
    options: {
      deep: true,
    },
  },
]
