import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, CardMedia, IconButton, Paper, SvgIcon, TextField, Typography, Zoom } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { mdiCardsSpade, mdiClose } from '@mdi/js'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/android-chrome-192x192.png'
import { loginUser } from '../../services/magic'

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
  const [alert, setAlert] = useState('')
  const history = useHistory()
  const handleSubmit = async e => {
    e.preventDefault()
    if (!email) {
      setAlert(t('pages.home.emailRequired'))
      document.getElementById('email').focus()
      return
    }
    try {
      setAlert('')
      await loginUser(email)
      history.replace('/table')
    } catch (error) {
      setAlert(error.message)
    } 
  }
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
      <form
        className={classes.form}
        onSubmit={handleSubmit}
      >
        <TextField
          id="email"
          className={classes.textField}
          onChange={e => setEmail(e.target.value)}
          placeholder={t('pages.home.placeholder')}
          type="email"
          value={email}
          variant="outlined"
        />
        <br />
        <Button
          className={classes.button}
          endIcon={<SvgIcon><path d={mdiCardsSpade} /></SvgIcon>}
          size="large"
          type="submit"
          variant="contained"
        >
          {t('pages.home.join')}
        </Button>
      </form>
      <Zoom in={!!alert}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {setAlert('')}}
            >
              <SvgIcon><path d={mdiClose} /></SvgIcon>
            </IconButton>
          }
          severity="error"
          variant="filled"
        >
          <AlertTitle>{t('pages.home.loginProblem')}</AlertTitle>
          {alert}
        </Alert>
      </Zoom>
    </Paper>
  )
}

export default createHomePage
