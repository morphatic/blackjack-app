import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Paper, SvgIcon, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { mdiCardsSpade } from '@mdi/js'
import { useTranslation } from 'react-i18next'
import { checkUser, loginUser } from '../../services/magic'
import createAlert from '../notifications/Alert'
import { AuthDispatchContext, AuthStateContext } from '../../contexts/AuthContext'

const useStyles = makeStyles(theme => ({
  root: {
    alignContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    // height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& .MuiAlert-root': {
      fontSize: '1.5rem',
      marginTop: '2rem',
      width: '40vw',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '4rem',
    }
  },
  alert: {
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
  const user = useContext(AuthStateContext)
  const setUser = useContext(AuthDispatchContext)
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState('')
  const history = useHistory()
  const Alert = createAlert()
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
      await checkUser(user.isLoggedIn, setUser)
      history.push('/table')
    } catch (error) {
      console.log('Something wrong. Not logging in.')
      setAlert(error.message)
    } 
  }
  return (
    <Paper className={classes.root} elevation={0}>
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
      <Alert
        className={classes.alert}
        message={alert}
        severity="error"
        title={t('pages.home.loginProblem')}
      />
    </Paper>
  )
}

export default createHomePage
