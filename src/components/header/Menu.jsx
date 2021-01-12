import { Box, Fade, makeStyles } from "@material-ui/core"
import { useTranslation } from 'react-i18next'
import { mdiCog, mdiExitRun } from '@mdi/js'
import Gravatar from 'react-gravatar'
import createIconButton from '../misc/IconButton'
import { logoutUser } from "../../services/magic"
import { useHistory } from "react-router-dom"

const useStyles = makeStyles({
  root: {
    alignContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: '20px',
    right: '25px',
    '& .MuiButtonBase-root': {
      marginLeft: '5px',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '2rem',
    },
  },
})

const createHeaderMenu = React => ({ isLoggedIn, email }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const classes = useStyles({ isLoggedIn })
  const IconButton = createIconButton()
  const handleLogout = async () => {
    try {
      await logoutUser()
      history.replace('/')
    } catch (error) {
      // TODO: replace with proper Alert
      console.log(error)
    }
  }
  return (
    <Fade in={isLoggedIn} timeout={1500}>
      <Box className={classes.root}>
        <IconButton
          icon={mdiCog}
          onClick={handleLogout}
          title={t('header.menu.preferences')}
        />
        <IconButton
          icon={mdiExitRun}
          onClick={handleLogout}
          title={t('header.menu.logout')}
        />
        <Gravatar
          default="identicon"
          email={email || ''}
          rating="pg"
          size={40}
          style={{ borderRadius: '50%', marginLeft: '15px' }}
        />
      </Box>
    </Fade>
  )
}

export default createHeaderMenu
