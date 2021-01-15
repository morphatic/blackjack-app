import { CssBaseline } from '@material-ui/core'
import React from 'react'
import createPlayingCard from './PlayingCard'

const PlayingCard = createPlayingCard(React)

const story = {
  title: 'Playing Cards/Playing Card',
  component: PlayingCard,
  argTypes: {
    color: {
      control: {
        options: {
          red: 'red',
          blue: 'blue',
        },
        type: 'inline-radio',
      },
      defaultValue: 'red',
      type: String,
    },
    isFaceUp: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
      type: Boolean,
    },
    rank: {
      control: {
        options: {
          Ace: 'a',
          '2': 2,
          '3': 3,
          '4': 4,
          '5': 5,
          '6': 6,
          '7': 7,
          '8': 8,
          '9': 9,
          '10': 10,
          Jack: 'j',
          Queen: 'q',
          King: 'k',
        },
        type: 'select',
      },
      defaultValue: 'a',
      type: String,
    },
    suit: {
      control: {
        options: {
          Spades: 's',
          Hearts: 'h',
          Clubs: 'c',
          Diamonds: 'd',
        },
        type: 'select',
      },
      defaultValue: 's',
      type: String,
    },
    width: {
      control: {
        max: 500,
        min: 50,
        type: 'range',
      },
      defaultValue: 150,
      type: Number,
    },
  },
  description:
    'The **PlayingCard** contains the site name and logo as well ' +
    'as settings, profile, and logout links when the user is ' +
    'logged in.'
}

const Template = ({ color, isFaceUp, rank, suit, width }) => (
  <div>
    <CssBaseline />
    <PlayingCard
      color={color}
      isFaceUp={isFaceUp}
      rank={rank}
      suit={suit}
      width={width}
    />
  </div>
)

export const Primary = Template.bind({})

export default story
