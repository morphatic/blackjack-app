
export const defaultRules = {
  seats: 5,
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
}

export const createGame = ({
  _id = null,
  rules = defaultRules,
  deckColor = 'red',
  hands = [],
  dealerCards = [],
  table = null,
  currentHand = 0,
  createdAt = null,
  updatedAt = null,
} = {}) => ({
  _id,
  rules,
  deckColor,
  hands,
  dealerCards,
  table,
  currentHand,
  createdAt,
  updatedAt,

  start: () => {

  }
})
