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
  const canDeal = h => h && isArr(h.cards) && h.cards.length === 0
  const canStand = h => h && isArr(h.cards) && h.cards.length >= 2
  const canHit = h => h && isArr(h.cards) && h.cards.length >= 2 && h.total() < 21
  const canSplit = h => h && splits < numberOfSplitsAllowed && h.canSplit(allowSplitsForAll10Cards)
  const canDoubleDown = h => h && isArr(h.cards) && h.cards.length === 2
    && allowableDoubleDownTotals.includes(h.total())
    && (!h.isSplit || allowDoublingAfterSplit)
  const canSurrender = h => h && isArr(h.cards)
    && h.cards.length === 2
    && ((isEarly && allowEarlySurrender) || (!isEarly && allowLateSurrender))
  const canInsure = (h, dc) => h && isArr(h.cards)
    && h.cards.length === 2
    && insuranceAvailable
    && ['10', 'j', 'q', 'k', 'a'].includes(dc[0].rank)

  // create buttons
  const StartButton = createButton()
  const DealButton = createButton()
  const StandButton = createButton()
  const HitButton = createButton()
  const SplitButton = createButton()
  const DoubleDownButton = createButton()
  const SurrenderButton = createButton()
  const InsureButton = createButton()

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
          <StartButton onClick={() => { setBet(minBet); setAction('collectBet')}}>
            {t('notifications.actions-dialog.start')}
          </StartButton>
        }
        {canDeal(hand) &&
          <DealButton onClick={() => setAction('deal')}>
            {t('notifications.actions-dialog.deal')}
          </DealButton>
        }
        {canStand(hand) &&
          <StandButton onClick={() => setAction('stand')}>
            {t('notifications.actions-dialog.stand')}
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
          <DoubleDownButton onClick={() => setAction('doubleDown')}>
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
      </DialogContent>
    </Dialog>
  )
}

export default createActionsDialog
