import { useContext } from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { Button, Paper, SvgIcon } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { mdiLogout } from '@mdi/js'
import { AuthContext } from "../../contexts/AuthContext"
import { logoutUser } from "../../services/magic"

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
}))


const createTablePage = React => () => {
  const classes = useStyles()
  const { email } = useContext(AuthContext)
  const history = useHistory()
  const { t } = useTranslation()
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
    <Paper className={classes.root} elevation={0}>
      <Button
        className={classes.button}
        variant="contained"
        endIcon={<SvgIcon><path d={mdiLogout} /></SvgIcon>}
        onClick={handleLogout}
        size="large"
      >
        {t('pages.table.logout')}
      </Button>
      <p>
        Hello, {email}!
      </p>
    </Paper>
  )
}

export default createTablePage
