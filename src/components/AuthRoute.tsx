import React, { Component } from 'react'
import { Redirect, Route } from 'react-router'
import Error403 from '../pages/errors/Error403'
import { isAuthenticated } from '../helpers/auth'

const AuthRoute = ({ component: Comp, auth: AuthFunction = () => {return true}, view: View = Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthenticated()
            ? AuthFunction()
                ? <Comp view={View} {...props}/>
                : <Error403/>
            : <Redirect to={{ pathname: '/login', state: { from: props.location }}}/>
    )}/>
)

export default AuthRoute
