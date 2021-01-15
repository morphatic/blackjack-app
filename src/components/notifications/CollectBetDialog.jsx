import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SvgIcon,
  TextField,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { mdiCardsSpade } from '@mdi/js'
import { createButton } from '../buttons/Button'
import { useState } from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTypography-root': {
      color: '#333',
      fontFamily: 'Raleway, sans-serif',
      fontSize: '2rem',
    },
    '& .MuiDialog-paper': {
      background: 'white',
      borderRadius: '15px',
      height: '44vh',
      width: '66vh',
      maxWidth: 'none',
      '& .MuiDialogTitle-root': {
        background: 'white',
        color: '333',
      },
      '& .MuiDialogContent-root': {
        background: 'white',
        color: '#333',
      },
      '& .MuiFormHelperText-root': {
        color: '#333',
      },
      '& .MuiDialogActions-root': {
        background: 'white',
      },
    },
  },
  textField: {
    justifySelf: 'center',
    backgroundColor: '#fff',
    borderRadius: '4px',
    margin: '2rem auto',
    '& .MuiInputBase-input': {
      border: '1px solid #777',
      borderRadius: '5px',
      color: '#333',
      fontFamily: 'Raleway, sans-serif',
      fontSize: '2rem',
      width: '30rem',
    }
  },
}))

const createCollectBetDialog = React => ({ open, player, bet, setBet, setAction }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [wager, setWager] = useState(bet)
  const SubmitButton = createButton()
  const maxBet = Math.min(player.preferences.rules.maxBet, player.chips)
  const updatePlayerBet = () => {
    setBet(bet)
    setAction('start')
  }
  return (
    <Dialog
      className={classes.root}
      aria-labelledby="form-dialog-title"
      open={open}
    >
      <DialogTitle id="form-dialog-title">{t('notifications.collect-bet-dialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('notifications.collect-bet-dialog.message')}
        </DialogContentText>
        <TextField
          className={classes.textField}
          autoFocus
          helperText={`${t('notifications.collect-bet-dialog.max')}: $${maxBet}`}
          inputProps={{ min: player.preferences.rules.minBet, max: maxBet, step: player.preferences.rules.betIncrement }}
          onChange={e => setWager(e.target.value)}
          type="number"
          value={wager}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <SubmitButton onClick={updatePlayerBet} endIcon={<SvgIcon><path d={mdiCardsSpade} /></SvgIcon>}>
          {t('notifications.collect-bet-dialog.submit')}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  )
}

export default createCollectBetDialog
