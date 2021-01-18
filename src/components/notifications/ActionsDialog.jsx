import { useTranslation } from 'react-i18next'
import { Container, Dialog, DialogContent, Zoom } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { createButton } from '../buttons/Button'

const useStyles = makeStyles({
  root: {
    // the backdrop
    '& .MuiBackdrop-root': {
      // display: 'none',
      visibility: 'hidden',
    },
    // the element containing the dialog
    '& .MuiDialog-scrollPaper': {
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    '& .MuiDialog-paperScrollPaper': {
      alignItems: 'flex-end',
    },
    // the actual dialog
    '& .MuiDialog-paper': {
      margin: '3rem', // default is 32px
    },
  },
})

export const createActionsDialog = React => props => {
  const { dealerCards, isEarly, hand, open, progress, rules, setAction, setBet, splits } = props
  const { t } = useTranslation()
  const classes = useStyles()
  const {
    allowableDoubleDownTotals,
    allowDoublingAfterSplit,
    allowEarlySurrender,
    allowLateSurrender,
    allowSplitsForAll10Cards,
    insuranceAvailable,
    minBet,
    numberOfSplitsAllowed,
  } = rules

  // check conditions
  const isArr = v => Array.isArray(v)
  const canStand = h => h && isArr(h.cards) && h.cards.length >= 2 && !['settled', 'notStarted', 'cleanup'].includes(progress)
  const canHit = h => h && isArr(h.cards) && h.cards.length >= 2 && h.total() < 21 && !['settled', 'notStarted', 'cleanup'].includes(progress)
  const canSplit = h => h && splits < numberOfSplitsAllowed && h.canSplit(allowSplitsForAll10Cards)
  const canDoubleDown = h => h && isArr(h.cards) && h.cards.length === 2
    && allowableDoubleDownTotals.includes(h.total())
    && (!h.isSplit || allowDoublingAfterSplit)
    && !['settled', 'notStarted', 'cleanup', 'doubled'].includes(progress)
  const canSurrender = h => h && isArr(h.cards)
    && h.cards.length === 2
    && ((isEarly && allowEarlySurrender) || (!isEarly && allowLateSurrender))
    && !['settled', 'notStarted', 'cleanup'].includes(progress)
  const canInsure = (h, dc) => h && isArr(h.cards)
    && h.cards.length === 2
    && insuranceAvailable
    && ['10', 'j', 'q', 'k', 'a'].includes(dc[0].rank)
    && !['settled', 'notStarted', 'cleanup'].includes(progress)

  // create buttons
  const StartButton      = createButton()
  const StandButton      = createButton()
  const HitButton        = createButton()
  const SplitButton      = createButton()
  const DoubleDownButton = createButton()
  const SurrenderButton  = createButton()
  const InsureButton     = createButton()
  const CleanUpButton    = createButton()

  // return component
  return (
    <Dialog
      className={classes.root}
      aria-labelledby="form-dialog-title"
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      open={open}
      PaperComponent={Container}
      PaperProps={{ maxWidth: false, style: { justifyContent: 'center' } }}
      TransitionComponent={Zoom}
    >
      <DialogContent>
        {progress === 'notStarted' &&
          <StartButton onClick={() => { setBet(minBet); setAction('bet')}}>
            {t('notifications.actions-dialog.start')}
          </StartButton>
        }
        {canStand(hand) &&
          <StandButton onClick={() => setAction('stand')}>
            {hand.total() <= 21 ? t('notifications.actions-dialog.stand') : 'Bust!'}
          </StandButton>
        }
        {canHit(hand) &&
          <HitButton onClick={() => setAction('hit')}>
            {t('notifications.actions-dialog.hit')}
          </HitButton>
        }
        {canSplit(hand) &&
          <SplitButton onClick={() => setAction('split')}>
            {t('notifications.actions-dialog.split')}
          </SplitButton>
        }
        {canDoubleDown(hand) &&
          <DoubleDownButton onClick={() => setAction('double')}>
            {t('notifications.actions-dialog.double-down')}
          </DoubleDownButton>
        }
        {canSurrender(hand) &&
          <SurrenderButton onClick={() => setAction('surrender')}>
            {t('notifications.actions-dialog.surrender')}
          </SurrenderButton>
        }
        {canInsure(hand, dealerCards) &&
          <InsureButton onClick={() => setAction('insure')}>
            {t('notifications.actions-dialog.insure')}
          </InsureButton>
        }
        {progress === 'settled' &&
          <CleanUpButton onClick={() => setAction('cleanup')}>
            {t('notifications.actions-dialog.clean-up')}
          </CleanUpButton>
        }
      </DialogContent>
    </Dialog>
  )
}

export default createActionsDialog
