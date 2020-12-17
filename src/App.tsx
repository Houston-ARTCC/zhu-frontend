import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom'
import axiosInstance from "./axiosInstance";
import qs from 'qs'
import Home from './Home'
import Theme from './Theme'
import AllEvents from './EventViews/AllEvents'
import ViewEvent from './EventViews/ViewEvent'
import Error404 from './ErrorViews/Error404'
import AllResources from "./ResourceViews/AllResources";

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/logout" component={Logout}/>
                <Route exact path="/events" component={AllEvents}/>
                <Route exact path="/events/:id" component={ViewEvent}/>
                <Route exact path="/resources" component={AllResources}/>
                <Route exact path="/theme" component={Theme}/>
                <Route component={Error404}/>
            </Switch>
        </BrowserRouter>
    );
}

function Login() {
    let { search } = useLocation()
    const auth_code = new URLSearchParams(search).get('code')

    useEffect(() => {
        if (auth_code) {
            axiosInstance
                .post('/auth/token/', qs.stringify({ code: auth_code }))
                .then(res => {
                    localStorage.setItem('access', res.data.access)
                    localStorage.setItem('refresh', res.data.refresh)
                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access
                    window.location.href = '/'
                })
                .catch(err => console.log(err))
        } else {
            window.location.href = 'https://auth.vatsim.net/oauth/authorize?client_id=593&redirect_uri=http://www.zhuartcc.devel/login&response_type=code&scope=full_name+vatsim_details+email'
        }
    })
    return null
}

function Logout() {
    useEffect(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        delete axiosInstance.defaults.headers['Authorization']
        window.location.href = '/'
    })
    return null
}
