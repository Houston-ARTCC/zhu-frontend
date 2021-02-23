import { Redirect, Route } from 'react-router'
import Error403 from '../pages/errors/Error403'
import { isAuthenticated } from '../helpers/auth'

const AuthRoute = ({ component: Component, auth: AuthFunction = () => {return true}, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthenticated()
            ? AuthFunction()
                ? <Component {...props}/>
                : <Error403/>
            : <Redirect to={{ pathname: '/login', state: { from: props.location }}}/>
    )}/>
)

export default AuthRoute
