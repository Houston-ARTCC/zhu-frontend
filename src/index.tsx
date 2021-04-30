import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import { SnackbarProvider } from 'notistack'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/theme.scss'
import './styles/theme-dark.scss'

ReactDOM.render(
    <React.StrictMode>
        <SnackbarProvider>
            <App/>
        </SnackbarProvider>
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
