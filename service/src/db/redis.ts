import * as console from 'console'
import * as redis from 'redis'
import { REDIS_CONF } from './redisconf'
// const redis = require('redis')
// 创建连接终端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host, { auth_pass: REDIS_CONF.password })
console.log('process', process.env.OPENAI_ACCESS_TOKEN)
// 监听存储过程出错
redisClient.on('error', (err) => {
  console.log(err)
})

const AUTH_PERFIX = 'chatgpt_auth'

function generateRandomString(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength))

  return result
}
// 存储值
function set(key, val) {
  if (typeof val === 'object')
    val = JSON.stringify(val)

  redisClient.set(key, val, redis.print)
}

// 读取值
function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      // 出错
      if (err) {
        reject(err)
        return
      }
      // 值为空
      if (val == null) {
        resolve(null)
        return
      }
      // 如果是json则转为对象，否则直接返回设置的值
      try {
        resolve(JSON.parse(val))
      }
      catch (ex) {
        resolve(val)
      }
    })
  })
  return promise
}

const getAuthCount = async (key) => {
  const count = await get(AUTH_PERFIX + key)
  console.log('count', count)
  if (count != null)
    return count
  return -1
}

const addNewKey = async (count, time) => {
  const key = generateRandomString(10)
  await redisClient.set(AUTH_PERFIX + key, count, 'EX', time * 60 * 24)
  return key
}
const decrKey = async (key) => {
  await redisClient.decr(AUTH_PERFIX + key)
  return key
}

export { redisClient, addNewKey, getAuthCount, decrKey }
