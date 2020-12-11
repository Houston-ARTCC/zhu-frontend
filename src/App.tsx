import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom'
import axiosInstance from "./axiosInstance";
import qs from 'qs'
import Home from './Home'
import Theme from './Theme'

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/theme" component={Theme}/>
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
                    localStorage.setItem('access_token', res.data.access_token)
                    localStorage.setItem('refresh_token', res.data.refresh_token)
                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access_token
                    window.location.href = '/'
                })
                .catch(err => console.log(err))
        } else {
            window.location.href = 'https://auth.vatsim.net/oauth/authorize?client_id=593&redirect_uri=http://www.zhuartcc.devel/login&response_type=code&scope=full_name+vatsim_details+email'
        }
    })

    return null
}
