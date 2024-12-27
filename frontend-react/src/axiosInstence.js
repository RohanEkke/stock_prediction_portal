import { faL } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL
const axiosInstence = axios.create({
    baseURL:baseURL,
    headers: {
        'Content-Type':'application/json',
    }
})

// Request interceptor
axiosInstence.interceptors.request.use(
    function (config) {
        // console.log('request==>', config)

        const accessToken = localStorage.getItem('accessToken');
        if (accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config;
    },
    function(error){
        return Promise.reject(error)
    }
)

// Response interceptor
axiosInstence.interceptors.response.use(
    function (response) {
        return response
    },

    // Handle failed responses
    async function(error) {
        const orignalRequest = error.config;
        if(error.response.status === 401 && !orignalRequest.retry){
            orignalRequest.retry = true;
            const refreshToken = localStorage.getItem('refreshToken')
            try{
                const response = await axiosInstence.post('/token/refresh/', {refresh:refreshToken})
                localStorage.setItem('accessToken', response.data.access)
                orignalRequest.headers['Authorization'] = `Bearer ${response.data.access}`
                return axiosInstence(orignalRequest)
            }
            catch(error){
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
            }
        }
        return Promise.reject(error)
    }
)
export default axiosInstence