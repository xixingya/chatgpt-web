import * as dotenv from 'dotenv'

dotenv.config()
const REDIS_CONF = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
}

export { REDIS_CONF }
