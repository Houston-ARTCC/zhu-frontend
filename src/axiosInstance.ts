import axios from 'axios'

const baseURL = 'http://api.zhuartcc.devel/'

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null,
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/x-www-form-urlencoded'
    }
})

axiosInstance.interceptors.response.use(
    response => response,
    err => {
        const originalRequest = err.config

        // Check if error occurred during token refresh
        if (err.response.status === 401 && originalRequest.url === baseURL + '/auth/token/refresh/') {
            window.location.href = '/login/'
            return Promise.reject(err)
        }

        // Check if error was caused by an expired access token
        if (err.response.data.code === 'token_not_valid' && err.response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token')

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

                if (tokenParts.exp > Math.ceil(Date.now() / 1000)) {
                    return axiosInstance
                        .post('/auth/token/refresh/', { refresh: refreshToken })
                        .then((res) => {
                            localStorage.setItem('access_token', res.data.access_token)
                            localStorage.setItem('refresh_token', res.data.refresh_token)

                            axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access_token
                            originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access_token

                            return axiosInstance(originalRequest)
                        })
                        .catch(err => console.log(err))
                }
            }
            window.location.href = '/login/'
        }
        return Promise.reject(err)
    }
)

export default axiosInstance
