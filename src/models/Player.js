
const defaultPreferences = {
  rules: {
    seats: 1,
    decks: 6,
    minBet: 5,
    maxBet: 2000,
    betIncrement: 5,
    allowEarlySurrender: false,
    allowLateSurrender: false,
    allowableDoubleDownTotals: [9, 10, 11],
    numberOfSplitsAllowed: 3,
    allowSplitsForAll10Cards: true,
    allowDoublingAfterSplit: true,
    payoutForBlackjack: 1.5,
    dealPlayersCardsFaceDown: false,
    dealerStandsOnSoft17: true,
    fiveCardCharlieWins: false,
    insuranceAvailable: true,
    secondsAllowedPerAction: 30,
    canOnlyHitOnceAfterAceSplit: true,
  },
  deckColor: 'red',
  playWithRobots: false,
}

export const createPlayer = ({
  email = '',
  name = '',
  chips = 0,
  history = [],
  preferences = defaultPreferences,
  ...args
} = {}) => ({
  email,
  name,
  chips,
  history,
  preferences,
  ...args
})
