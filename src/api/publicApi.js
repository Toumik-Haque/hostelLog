import axios from 'axios'

const publicApi = axios.create({
  baseURL: 'http://https://hostellog-api.onrender.com/api'
})

export default publicApi