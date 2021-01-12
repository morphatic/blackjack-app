import { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthStateContext } from '../contexts/AuthContext'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useContext(AuthStateContext)
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  )
}
export default ProtectedRoute
