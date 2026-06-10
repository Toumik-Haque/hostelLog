import axios from 'axios'

const adminApi = axios.create({
  baseURL: 'https://hostellog-api.onrender.com/api'
})

// adminApi.interceptors.request.use((config) => {

//   const token = localStorage.getItem('adminToken')

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return config
// })

adminApi.interceptors.request.use((config) => {

  const token = localStorage.getItem('adminToken')

  console.log('TOKEN SENT:', token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  console.log(config.headers)

  return config
})

export default adminApi

