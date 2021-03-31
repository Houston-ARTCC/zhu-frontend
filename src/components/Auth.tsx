import { useHistory, useLocation } from 'react-router'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import axiosInstance from '../helpers/axiosInstance'
import { getAuthURL, getFullName } from '../helpers/auth'
import LoadingScreen from './LoadingScreen'

export function Login(props) {
    let { search } = useLocation()
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    const auth_code = new URLSearchParams(search).get('code')

    useEffect(() => {
        if (auth_code) {
            axiosInstance
                .post('/auth/token/', { code: auth_code })
                .then(res => {
                    localStorage.setItem('access', res.data.access)
                    localStorage.setItem('refresh', res.data.refresh)
                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access

                    enqueueSnackbar('Logged in as ' + getFullName(), {
                        variant: 'success',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                })
                .catch(err => {
                    enqueueSnackbar(err.toString(), {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                    })
                })
                .finally(() => {
                    history.push(localStorage.getItem('login-referrer') || '/')
                    localStorage.removeItem('login-referrer')
                })
        } else {
            localStorage.setItem('login-referrer', props.location.state?.from.pathname || '/')
            window.location.href = getAuthURL()
        }
    })
    return <LoadingScreen/>
}

export function Logout() {
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        delete axiosInstance.defaults.headers['Authorization']

        enqueueSnackbar('You have been logged out, see you soon!', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            },
        })

        history.push('/')
    })
    return <LoadingScreen/>
}
