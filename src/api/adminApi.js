import axios from 'axios'

const adminApi = axios.create({
  baseURL: 'https://hostellog-api.onrender.com/api'
})

adminApi.interceptors.request.use((config) => {

  const token = localStorage.getItem('adminToken')

  console.log('TOKEN SENT:', token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  console.log(config.headers)

  return config
})

// Handle expired / invalid admin token
adminApi.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem('adminToken')

      window.location.href = '/admin-login'
    }

    return Promise.reject(error)
  }
)

export default adminApi
