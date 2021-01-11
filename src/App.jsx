import { useEffect, useState } from 'react'
import {
  // AppBar,
  Box,
  Container,
  // List,
  // SwipeableDrawer,
  // Toolbar,
  // Typography,
} from '@material-ui/core'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import createHomePage from './components/pages/Home'
import ProtectedRoute from './router/ProtectedRoute'
import createTablePage from './components/pages/Table'
import { checkUser } from './services/magic'


const createApp = React => () => {
  const [user, setUser] = useState({ isLoggedIn: false, email: '' })
  useEffect(() => {
    const validateUser = async () => {
      try {
        await checkUser(setUser)
      } catch (error) {

      }
    }
    validateUser()
  }, [user.isLoggedIn])
  return (
    <AuthContext.Provider value={user}>
      <Router>
        <Container>
          <Box>
            <main>
              {user.isLoggedIn && <Redirect to={{ pathname: '/table' }} />}
              <Switch>
                <Route exact path="/" component={createHomePage()} />
                <ProtectedRoute path="/table" component={createTablePage()} />
              </Switch>
            </main>
          </Box>
        </Container>
      </Router>
    </AuthContext.Provider>
  )
}

export default createApp
