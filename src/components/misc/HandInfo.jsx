import { useTranslation } from "react-i18next"

export const createHandInfo = React => ({ hands, seatPositions }) => {
  const { t } = useTranslation()
  const style = ({ left, top, transform}) => ({
    color: '#fff',
    fontFamily: 'Raleway, sans-serif',
    fontSize: '1rem',
    left: (Math.round(+left)) + 'px',
    position: 'absolute',
    textAlign: 'center',
    top: (Math.round(+top) + 188) + 'px',
    // transform,
    width: '180px',
  })
  const infoBoxes = []
  let i = 0
  if (hands.length > 0 && !!seatPositions) {
    for (const [seat, position] of Object.entries(seatPositions)) {
      const hand = hands[i]
      const player = hand.player
      const soft = hand.isSoft() || false
      const total = hand.total() || '--'
      const bet = hand.bet || 0
      infoBoxes.push(<div key={seat} id={seat} style={style(position)}>
        {t('pages.table.current-total')}: {soft && t('pages.table.soft')} {total}<br />
        {t('pages.table.current-bet')}: ${bet}<br />
        {t('pages.table.chips')}: ${player.chips}<br /><br />
        {player.name}
      </div>)
      i += 1
    }
  }

  return (
    <div>
      {infoBoxes}
    </div>
  )
}

export default createHandInfo