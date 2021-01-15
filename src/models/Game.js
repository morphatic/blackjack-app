export const defaultRules = {
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
}

export const createGame = params => ({
  rules = defaultRules,
  hands = [],
  dealerCards = [],
  table = null,
  currentHand = 0,
  ...args
} = {}) => ({
  rules,
  hands,
  dealerCards,
  table,
  currentHand,
  ...args,
  isComplete() { return this.hands.every(h => h.isClosed()) },
  raw() { return JSON.parse(JSON.stringify(this)) },
  inProgress() { return this.hands.length !== 0 && !this.isComplete() },
})
