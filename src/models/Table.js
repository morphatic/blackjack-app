
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
  canOnlyHitOnceAfterAceSplit: true,
}

export const createTable = ({
  deck = null,
  games = [],
  seats = 5, // I don't think we're going to use this, since it is a property of the game
  ...args
} = {}) => ({
  deck,
  games,
  seats,
  ...args,
  raw() { JSON.parse(JSON.stringify(this)) },
  gameInProgress() { return this.games[this.games.length - 1]?.isComplete || false },
})
