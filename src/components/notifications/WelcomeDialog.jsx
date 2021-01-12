import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SvgIcon,
  TextField,
  // Typography
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { mdiCardsSpade } from '@mdi/js'
import { AuthDispatchContext, AuthStateContext } from '../../contexts/AuthContext'
import { updatePlayer } from '../../services/players'

const useStyles = makeStyles(theme => ({
  paper: {
    background: 'white',
    borderRadius: '15px',
    height: '40vh',
    width: '60vh',
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
      transform: 'rotate(90deg)',
      width: '2rem',
    },
    '&:hover': {
      backgroundColor: '#030',
      color: '#fbc02d',
    },
  },
  text: {
    color: '#333',
  },
  textField: {
    justifySelf: 'center',
    backgroundColor: '#fff',
    borderRadius: '4px',
    margin: '2rem auto',
    '& .MuiInputBase-input': {
      color: '#333',
      fontFamily: 'Raleway, sans-serif',
      fontSize: '2rem',
      width: '30rem',
    }
  },
}))

const createWelcomeDialog = React => ({open}) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const user = useContext(AuthStateContext)
  const setUser = useContext(AuthDispatchContext)
  const [name, setName] = useState(user.player.name)
  const updatePlayerName = async () => {
    const player = await updatePlayer(user.player, { name }, user.did)
    console.log(player)
    setUser({ ...user, player })
  }
  return (
    <Dialog
      className={classes.paper}
      aria-labelledby="form-dialog-title"
      open={open}
    >
      <DialogTitle id="form-dialog-title">{t('notifications.welcome-dialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('notifications.welcome-dialog.message')}
        </DialogContentText>
        <TextField
          className={classes.textField}
          autoFocus
          onChange={e => setName(e.target.value)}
          placeholder={t('notifications.welcome-dialog.placeholder')}
          value={name}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.button}
          endIcon={<SvgIcon><path d={mdiCardsSpade} /></SvgIcon>}
          onClick={updatePlayerName}
          size="large"
          variant="contained"
        >
          {t('notifications.welcome-dialog.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default createWelcomeDialog
