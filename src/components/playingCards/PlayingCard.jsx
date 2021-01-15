import { useEffect, useState } from 'react'
import cx from 'classnames'
import styles from './PlayingCard.module.css'

export const createPlayingCard = React => ({ color, isFaceUp, owner, rank, style, suit, value, width }) => {
  const [cardProps, setCardProps] = useState({
    color: 'red',
    suit: '',
    rank: '',
    face: 'blank',
    owner,
    size: { width: '240px', height: '360px' },
    value: 0,
    width: 240,
    isFaceUp: false,
  })

  useEffect(() => {
    const newProps = {}
    // if the rank or suit has changed
    if (
      (rank && rank !== cardProps.rank) ||
      (suit && suit !== cardProps.suit)
    ) {
      // get the new image
      newProps.suit = suit
      newProps.rank = rank
      newProps.face = `${suit}${rank}`
    }
    // if the card color has changed
    if (color && color !== cardProps.color) {
      // get the new color
      newProps.color = color
    }
    if (value !== cardProps.value) {
      newProps.value = value
    }
    if (isFaceUp !== cardProps.isFaceUp) {
      newProps.isFaceUp = isFaceUp
    }
    if (width && width !== cardProps.width) {
      newProps.width = width
      newProps.height = width * 1.5
      newProps.size = { width: `${width}px`, height: `${width * 1.5}px` }
    }

    // integrate the changes
    setCardProps({ ...cardProps, ...newProps }) 
  }, [isFaceUp, rank, suit, color, value, width]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cx(styles.playingCard,  {[styles.isFaceUp]: cardProps.isFaceUp })} style={{ ...cardProps.size, ...style }}>
      <div className={styles.playingCardInner}>
        <div className={cx(styles.playingCardBack, { [styles.blue]: cardProps.color === 'blue', [styles.red]: cardProps.color === 'red' })} />
        <div className={cx(styles.playingCardFace, { [styles[cardProps.face]]: true })} />
      </div>
    </div>
  )
}

export default createPlayingCard
