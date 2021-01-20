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

const bjsort = cards => {
  const val = c => c.rank === 'a' ? 11 : ['j', 'q', 'k'].includes(c.rank) ? 10 : parseInt(c.rank)
  return [...cards].sort((a, b) => {
    if (val(a) > val(b)) {
      return 1
    } else if (val(b) > val(a)) {
      return -1
    } else {
      return 0
    }
  })
}

const sum = (cards, isDealer = false, dealerStandsOnSoft17 = false) => {
  // count the aces
  let aces = cards.reduce((a, c) => c.rank === 'a' ? a + 1 : a, 0)
  // calculate the total
  let a = 0
  return bjsort(cards).reduce((t, c) => {
    if (['10', 'j', 'q', 'k'].includes(c.rank)) {
      return t + 10
    } else if (c.rank === 'a') {
      a += 1
      if (isDealer) {
        if (dealerStandsOnSoft17) {
          // if last ace and A==11=>17-21, A = 11 : A = 1
          return a === aces && t + 11 <= 21 && t + 11 >= 17 ? t + 11 : t + 1
        } else {
          // if last ace and A==11=>18-21, A = 11 : A = 1
          return a === aces && t + 11 <= 21 && t + 11 >= 18 ? t + 11 : t + 1
        }
      } else {
        // rule for players, only last ace considered
        // possibly 11
        return a === aces && t + 11 <= 21 ? t + 11 : t + 1
      }
    } else {
      return +c.rank + t
    }
  }, 0)
}

export const createHand = ({
  bet = 5,
  cards = [],
  game = null,
  isDoubled = false,
  isInsured = false,
  isSplit = false, // if a hand is the result of a split, this should be set to true
  payout = 0,
  player = null,
  result = undefined,
  seat = 0,
  splitFromAceOrTen = false,
  surrendered = false,
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
  seat,
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