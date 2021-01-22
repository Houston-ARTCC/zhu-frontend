import { Redirect, Route } from 'react-router'
import { isAuthenticated } from '../Helpers'
import Error403 from '../ErrorViews/Error403'

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
