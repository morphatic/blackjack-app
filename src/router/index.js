import createHomePage from '../components/pages/Home'
import createTablePage from '../components/pages/Table'

const createRoutes = React => ([
  {
    component: createHomePage(React),
    path: '/',
    name: 'home',
  },
  {
    component: createTablePage(React),
    path: '/table',
    name: 'table',
  },
])

export default createRoutes
