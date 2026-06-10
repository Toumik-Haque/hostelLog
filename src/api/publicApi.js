import axios from 'axios'

const publicApi = axios.create({
  baseURL: 'http://hostellog-api.onrender.com/api'
})

export default publicApi