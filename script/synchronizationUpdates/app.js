const cheerio = require('cheerio')
const request = require('./request')
const axios = require("axios");

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const randomDelay = (min, max) => sleep(Math.floor(Math.random() * (max - min + 1)) + min)

const MAX_RETRIES = 5

const addBookWithRetry = async (number) => {
  let retries = 0
  while (retries < MAX_RETRIES) {
    try {
      const data = await axios.post('http://127.0.0.1:8080/api/books/add/' + number, null, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      })
      console.log(data.data, '添加结果')
      return
    } catch (err) {
      retries++
      console.log(`错误 (第${retries}次重试)`, err.status || err.message)
      if (retries >= MAX_RETRIES) {
        console.log(`书本 ${number} 添加失败，已达最大重试次数 ${MAX_RETRIES}`)
        return
      }
      // 指数退避: min(3s * 2^retries, 30s) + 随机抖动
      const backoff = Math.min(3000 * Math.pow(2, retries), 30000)
      const jitter = Math.floor(Math.random() * 2000)
      console.log(`等待 ${(backoff + jitter) / 1000}s 后重试...`)
      await sleep(backoff + jitter)
    }
  }
}

const analyzeBooks = async (pageNum) => {
  const data = await request.get(`/List/default.aspx?tid=-1&&ud=7&PageIndex=${pageNum}`);
  if (data.status === 200) {
    const $ = cheerio.load(data.data);
    const booksLink = $(".bsubcon .Comic_Pic_List>.Conjunction>a");
    if (booksLink.length === 0) {
      return -1;
    }
    const links = []
    booksLink.each((index, element) => {
      const href = $(element).attr('href');
      const match = href.match(/\/Novel\/(\d+)\//)
      if (match) {
        links.push(match[1])
      } else {
        console.log('No match found');
      }
    })
    console.log(`第 ${pageNum} 页共 ${links.length} 本书`)
    // 3本并发调用后端API（调用的是localhost，无需反爬延迟）
    for (let i = 0; i < links.length; i += 3) {
      const batch = links.slice(i, i + 3)
      console.log(`  处理 ${i + 1}-${Math.min(i + 3, links.length)}/${links.length}`)
      await Promise.all(batch.map(number => addBookWithRetry(number)))
    }
  }
}

const getStore = async () => {
  try {
    let pageNum = 1
    while (true) {
      console.log(`正在处理第 ${pageNum} 页...`)
      const res = await analyzeBooks(pageNum);
      // 没查询到数据,爬到底了,直接中断
      if (res === -1) {
        console.log(`获取完成, 共${pageNum - 1}页`)
        break;
      }
      pageNum++
      // 页间延迟 1~3s
      await randomDelay(1000, 3000)
    }
  } catch (err) {
    console.log(err)
    throw new Error('爬取首页错误')
  }
}
getStore()
