import axios from 'axios'

const publicApi = axios.create({
  baseURL: 'https://hostellog-api.onrender.com/api'
})

export default publicApi