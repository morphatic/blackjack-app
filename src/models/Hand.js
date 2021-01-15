export const handDefaults = {
  bet: 5,
  cards: [],
  game: null,
  isClosed: false,
  isDoubled: false,
  isInsured: false,
  player: null,
  result: null,
}

const sum = cards => cards.reduce((t, c) => {
  if (['10', 'j', 'q', 'k'].includes(c.rank)) {
    return t + 10
  } else if (c.rank === 'a') {
    return t + 11 > 21 ? t + 1 : t + 11
  } else {
    return +c.rank + t
  }
}, 0)

export const createHand = ({
  bet = 5,
  cards = [],
  game = null,
  isDoubled = false,
  isInsured = false,
  isSplit = false, // if a hand is the result of a split, this should be set to true
  player = null,
  result = undefined,
  splitFromAceOrTen = false,
  ...args
} = {}) => ({
  bet,
  cards,
  game,
  isDoubled,
  isInsured,
  isSplit,
  player,
  result,
  splitFromAceOrTen,
  ...args,
  raw() { return JSON.parse(JSON.stringify(this)) },
  total() { return sum(this.cards) },
  isBust() { return this.total() > 21 },
  isClosed() { return !!this.result },
  canSplit(allowSplitsForAll10Cards) {
    return !this.isSplit
      && this.cards.length === 2
      && ((this.cards[0].rank === this.cards[1].rank) 
        || (allowSplitsForAll10Cards && this.cards.every(c => ['10', 'j', 'q', 'k'].includes(c.rank))))
  },
  isSoft() { return this.cards.length === 2 && this.cards.map(c => c.rank).includes('a') },
  // technically, NOT blackjack if resulting from split aces or ten cards
  isBlackjack() { return this.total() === 21 && this.cards.length === 2 && !this.splitFromAceOrTen },
})