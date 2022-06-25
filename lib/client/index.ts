import axios from 'axios'
import toast from 'react-hot-toast'

export const client = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true
})

client.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        const { response } = error
        if (response?.status === 401) {
            // not authenticated
            window.open('/auth/login', '_self')
        }
        if (response?.status >= 400 || response?.status <= 500) {
            const errorMessage = response?.data?.message
            toast.error(errorMessage, { style: { textTransform: 'capitalize' } })
        }
        return Promise.reject(error)
    }
)
