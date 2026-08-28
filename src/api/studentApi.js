import axios from 'axios'

const studentApi = axios.create({
  baseURL: 'https://hostellog-api.onrender.com/api'
})

studentApi.interceptors.request.use((config) => {

  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle expired / invalid user token
studentApi.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem('token')

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default studentApi