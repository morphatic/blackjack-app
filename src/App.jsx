import { useEffect, useState } from 'react'
import { Container } from '@material-ui/core'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { AuthDispatchContext, AuthStateContext } from './contexts/AuthContext'
import createHomePage from './components/pages/Home'
import ProtectedRoute from './router/ProtectedRoute'
import createTablePage from './components/pages/Table'
import { checkUser } from './services/magic'
import createHeader from './components/header/Header'
import createHeaderMenu from './components/header/Menu'

const createApp = React => () => {
  const [user, setUser] = useState({ isLoggedIn: false, did: null, player: null })
  useEffect(() => {
    const validateUser = async () => {
      try {
        await checkUser(setUser)
      } catch (error) {
        console.log(error)
      }
    }
    validateUser()
  }, [user.isLoggedIn])
  const Header = createHeader()
  const HeaderMenu = createHeaderMenu()
  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={setUser}>
        <Router>
          <Container maxWidth={false}>
            <Header isLoggedIn={user.isLoggedIn} />
            <HeaderMenu isLoggedIn={user.isLoggedIn} email={user.player?.email} />
            {user.isLoggedIn && <Redirect to={{ pathname: '/table' }} />}
            <Switch>
              <Route exact path="/" component={createHomePage()} />
              <ProtectedRoute path="/table" component={createTablePage()} />
            </Switch>
          </Container>
        </Router>
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export default createApp
