import { Box, CardMedia, makeStyles } from "@material-ui/core"
import { useTranslation } from 'react-i18next'
import logo from '../../assets/android-chrome-192x192.png'

const useStyles = makeStyles({
  root: {
    alignContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: ({ isLoggedIn }) => isLoggedIn ? 'wrap' : 'nowrap',
    height: ({ isLoggedIn }) => isLoggedIn ? '80px' : '50vh',
    justifyContent: 'flex-end',
    transition: 'height .5s  ease-in-out, flex-wrap .5s ease-in-out',
  },
  media: {
    display: 'flex-item',
    height: ({ isLoggedIn }) => isLoggedIn ? '80px' : '192px',
    width: ({ isLoggedIn }) => isLoggedIn ? '80px' : '192px',
    transition: 'height .5s ease-in-out, width .5s ease-in-out',
  },
  title: {
    fontFamily: '"Algerian", cursive',
    fontSize: ({ isLoggedIn }) => isLoggedIn ? '3rem' : '6.5rem',
    fontWeight: 'normal',
    marginBottom: '0',
    transition: 'font-size .5s ease-in-out',
  }
})

const createHeader = React => ({ isLoggedIn }) => {
  const { t } = useTranslation()
  const classes = useStyles({ isLoggedIn })
  return (
    <Box className={classes.root}>
      <CardMedia
        className={classes.media}
        image={logo}
        title="Blackjack Logo"
      />
      <h1
        className={classes.title}
        variant={isLoggedIn ? 'h3' : 'h1'} align="center"
      >
        {t('header.blackjack')}
      </h1>
    </Box>
  )
}

export default createHeader
