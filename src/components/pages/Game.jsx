import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import createTableGraphics from '../misc/TableGraphics'
// import isEqual from 'lodash/fp/isEqual'
import createHandInfo from '../misc/HandInfo'

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
    justifyContent: 'center',
  },
}))

const createGamePage = React => ({ game, playingCards, seatPositions, setSeatPositions }) => {
  const classes = useStyles()

  // components
  const TableGraphics = createTableGraphics()       // draws the actual board on the screen
  const HandInfo = createHandInfo()                 // hand status info for each hand

  // The actual Table component
  return (
    <Paper className={classes.root} elevation={0}>
      <TableGraphics game={game} seatPositions={seatPositions} setSeatPositions={setSeatPositions} />
      <HandInfo hands={game.hands} seatPositions={seatPositions} />
    </Paper>
  )
}

export default createGamePage
