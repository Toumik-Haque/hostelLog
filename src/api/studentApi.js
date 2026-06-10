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

export default studentApi