import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.18.47:3333',
})
