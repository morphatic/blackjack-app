import { useContext, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AuthStateContext } from '../../contexts/AuthContext'
import { defaultGameContext, GameDispatchContext, GameStateContext } from '../../contexts/GameContext'
import createWelcomeDialog from '../notifications/WelcomeDialog'
import createTableLayout from '../misc/TableLayout'

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'black',
    color: 'white',
    fontFamily: 'Raleway, sans-serif',
    fontSize: '2rem',
    paddingLeft: '2.5rem',
    paddingRight: '2.5rem',
    '& .MuiSvgIcon-root': {
      height: '2rem',
      marginLeft: '0.5rem',
      width: '2rem',
    },
    '&:hover': {
      backgroundColor: '#030',
      color: '#fbc02d',
    },
  },
}))


const createTablePage = React => () => {
  const classes = useStyles()
  const { player } = useContext(AuthStateContext)
  const [game, setGame] = useState(defaultGameContext)
  // const { t } = useTranslation()
  const WelcomeDialog = createWelcomeDialog()
  const TableLayout = createTableLayout()
  return (
    <GameStateContext.Provider value={game}>
      <GameDispatchContext.Provider value={setGame}>
        <Paper className={classes.root} elevation={0}>
          <TableLayout />
          <WelcomeDialog open={player.name === ''} />
        </Paper>
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  )
}

export default createTablePage
