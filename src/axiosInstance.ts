import axios from 'axios'

const baseURL = 'http://api.zhuartcc.devel/'

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('access') && 'Bearer ' + localStorage.getItem('access'),
        'Content-Type': 'application/json',
        'accept': 'application/json',
    },
})

axiosInstance.interceptors.response.use(
    response => response,
    err => {
        const originalRequest = err.config

        // Check if connection to API failed
        if (!err.response) {
            return Promise.reject(err)
        }

        // Check if error occurred during token refresh
        else if (err.response.status === 401 && originalRequest.url === baseURL + 'auth/token/refresh/') {
            window.location.href = '/login/'
            return Promise.reject(err)
        }

        // Check if error was caused by an expired access token
        else if (err.response.data.code === 'token_not_valid' && err.response.status === 401) {
            const refreshToken = localStorage.getItem('refresh')

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

                // Obtains a new access token if refresh token is still valid, otherwise redirects to login
                if (tokenParts.exp > Math.ceil(Date.now() / 1000)) {
                    return axiosInstance
                        .post('/auth/token/refresh/', { refresh: refreshToken })
                        .then((res) => {
                            localStorage.setItem('access', res.data.access)

                            axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access
                            originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access

                            return axiosInstance(originalRequest)
                        })
                        .catch((res) => {
                            return Promise.reject(err)
                        })
                } else {
                    window.location.href = '/login'
                    return Promise.reject(err)
                }
            }
        }
        return Promise.reject(err)
    }
)

export default axiosInstance
