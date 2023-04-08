import * as dotenv from 'dotenv'

dotenv.config()
const REDIS_CONF = {
  port: 6379,
  host: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
}

export { REDIS_CONF }
