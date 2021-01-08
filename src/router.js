import createHomePage from './components/pages/Home'

const createRoutes = React => ([
  {
    component: createHomePage(React),
    path: '/',
    name: 'home',
  }
])

export default createRoutes
