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
  Route,
  Switch
} from 'react-router-dom'
import createRoutes from './router'


const createApp = React => () => {
  const routes = createRoutes(React)

  return (
    <Router>
      <Container>
        <Box>
          <main>
            <Switch>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  render={() => {
                    const Component = route.component
                    return <Component />
                  }}
                />
              ))}
            </Switch>
          </main>
        </Box>
      </Container>
    </Router>
  )
}

export default createApp
