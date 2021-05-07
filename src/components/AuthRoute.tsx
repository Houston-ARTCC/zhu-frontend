import { Redirect, Route } from 'react-router'
import Error403 from '../pages/errors/Error403'
import { isAuthenticated } from '../helpers/auth'

const AuthRoute = ({ component: Comp, auth: AuthFunction = isAuthenticated, view, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthenticated()
            ? AuthFunction()
                ? <Comp view={view} {...props}/>
                : <Error403/>
            : <Redirect to={{ pathname: '/login', state: { from: props.location }}}/>
    )}/>
)

export default AuthRoute
