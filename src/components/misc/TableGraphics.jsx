import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import isEqual from 'lodash/fp/isEqual'
import { Box, CardMedia, Container } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import createDealerRules from './DealerRules'
import insurance from '../../assets/Insurance.svg'

const iar = 307/895 // insurance banner aspect ratio
const iw = 65 // insurance banner width

const Seat = props => (<div ref={props.p} id={props.id} style={props.style}></div>)

const getCoords = ({ n, a, r }) => [...Array(n)].map((e, i) => {
  const deg = (90 - (a / 2)) + ((a / (n + 1)) * (i + 1))
  const rad = deg * Math.PI / 180
  return {
    x: r * Math.cos(rad),
    y: r * Math.sin(rad),
    t: 90 - deg,
  }
})

const getStyle = ({ h, b, c, w,  x, y, t }) => ({
  position: 'absolute',
  border: `${b}px solid ${c}`,
  borderRadius: h === 'circle' ? '50%' : '15px',
  width: `${w}px`,
  left: `-${w / 2}px`,
  height: `${h === 'circle' ? w : w * 1.5}px`,
  top: `-${h === 'circle' ? w / 2 : w * 0.75}px`,
  // transform: `translate(calc(50vw - ${x}vh), ${y}vh) rotate(${t}deg)`,
  transform: `translate(calc(50vw - ${x}vh), calc(-5vh + ${y}vh)) rotate(${t}deg)`,
})

const getSeats = ({
  p = null, // ref that will allow us to get the position and store it in the context
  n = 4, // number of seats
  a = 140, // span of arc
  r = 90, // radius from dealer
  h = 'card', // shape
  b = 5, // border width
  c = '#dba437', // color
  w = 180, // width of shape
} = {}) => getCoords({ n, a, r })
  .map((s, i) => (<Seat key={`seat${i}`} p={p} id={`seat${i}`} style={getStyle({ h, b, c, w, ...s })}></Seat>))

const useStyles = makeStyles({
  root: {
    height: '100vh',
    left: '0',
    position: 'absolute',
    top: '0',
    width: '100vw',
  },
  insurance: {
    position: 'absolute',
    height: `${iw * iar}vw`,
    top: `calc(45vh - ${iw * iar / 2}vw)`,
    width: `${iw}vw`,
    left: `calc(50vw - ${iw / 2}vw)`,
  },
  payout: {
    color: '#dba437',
    fontFamily: 'Raleway, sans-serif',
    fontSize: '4rem',
    position: 'absolute',
    textAlign: 'center',
    top: '33vh',
  }
})

const createTableGraphics = React => (props) => {
  const { t } = useTranslation()
  const { seatPositions, setSeatPositions } = props
  const [payout] = useState(props.game.rules.payoutForBlackjack)
  const classes = useStyles()

  // call back passed to ref to store seat position data in the game context
  const p = div => {
    if (div) {
      const { left, top } = div.getBoundingClientRect()
      const { transform } = div.style
      const newPositions = { ...seatPositions, [div.id]: { left, top, transform } }
      if (!isEqual(newPositions, seatPositions)) {
        setSeatPositions({ ...seatPositions, ...newPositions })
      }
    }
  }

  // generate the seats
  const seats = getSeats({ n: props.game.rules.seats, p })
  const DealerRules = createDealerRules()
  return (
    <Box className={classes.root}>
      <CardMedia
        className={classes.insurance}
        image={insurance}
        title={t('misc.table-layout.insurance')}
      />
      <Container className={classes.payout} maxWidth={false}>
        {t(`misc.house-payout.${payout === 1.5 ? '3to2' : '6to5'}`)}
      </Container>
      <DealerRules game={props.game} />
      {seats}
    </Box>
  )
}

export default createTableGraphics
