const axios = require('axios')
const { baseUrl } = require('../config')
const request = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Referer': 'https://book.sfacg.com/'
  }
})
request.interceptors.request.use((config) => {
  config.baseURL = baseUrl
  return config
}, error => {
  return error
})
request.interceptors.response.use(data => {
  return data
}, (error) => {
  return error
})
module.exports = request
