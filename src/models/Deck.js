export const deckDefaults = {
  _id: null,
  cards: [],
  inPlay: [],
  discards: [],
  markerPosition: 0,
  packs: 6,
}

export const createDeck = ({
  cards = [],
  inPlay = [],
  discards = [],
  markerPosition = 0,
  packs = 6,
  ...args
} = {}) => ({
  cards,
  inPlay,
  discards,
  markerPosition,
  packs,
  ...args,
  raw() { return JSON.parse(JSON.stringify(this)) },
  size() { return this.packs * 52 },
})