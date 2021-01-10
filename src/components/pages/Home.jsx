import { useState } from 'react'
import { Button, CardMedia, Paper, SvgIcon, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { mdiCardsSpade } from '@mdi/js'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/android-chrome-192x192.png'

const useStyles = makeStyles(theme => ({
  root: {
    background: 'transparent',
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
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
      transform: 'rotate(90deg)',
      width: '2rem',
    },
    '&:hover': {
      backgroundColor: '#030',
      color: '#fbc02d',
    },
  },
  form: {
    textAlign: 'center',
  },
  media: {
    height: '192px',
    width: '192px',
    margin: '0px auto',
  },
  text: {
    fontSize: '2rem',
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

const createHomePage = React => () => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [email, setEmail] = useState('')
  return (
  <Paper className={classes.root} elevation={0}>
    <CardMedia
      className={classes.media}
      image={logo}
      title="Blackjack Logo"
    />
    <Typography variant="h1" align="center">
      {t('pages.home.blackjack')}
    </Typography>
    <Typography
      className={classes.text}
      variant="body1"
      align="center"
    >
      {t('pages.home.teaser')}
    </Typography>
    <form className={classes.form}>
      <TextField
        className={classes.textField}
        onChange={e => setEmail(e.target.value)}
        placeholder={t('pages.home.placeholder')}
        value={email}
        variant="outlined"
      />
      <br />
      <Button
        className={classes.button}
        variant="contained"
        endIcon={<SvgIcon><path d={mdiCardsSpade} /></SvgIcon>}
        size="large"
      >
        {t('pages.home.join')}
      </Button>
    </form>
  </Paper>
  )
}

export default createHomePage
