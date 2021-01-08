import { BrowserRouter as Router/*, Route, Switch*/ } from 'react-router-dom'
import createRoutes from './router'

const createApp = React => () => {
  const routes = createRoutes(React)

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <ul>
            {routes.map(route => (
              <li>
                <a href={route.path} key={route.name}>{route.name}</a>
              </li>
            ))}
          </ul>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </Router>
  )
}

export default createApp
