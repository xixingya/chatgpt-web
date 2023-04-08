import { decrKey, getAuthCount } from '../db/redis'

const auth = async (req, res, next) => {
  try {
    const Authorization = req.header('Authorization')
    if (!Authorization)
      throw new Error('Error: 无访问权限 | No access rights')

    const key = Authorization.replace('Bearer ', '').trim()
    const count = await getAuthCount(key)
    if (count <= 0)
      throw new Error('Error: 无访问权限 | No access rights')
    if (req.url.startsWith('/chat-process'))
      decrKey(key)
    next()
  }
  catch (error) {
    res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
  }

  // if (isNotEmptyString(AUTH_SECRET_KEY)) {
  //   try {
  //     const Authorization = req.header('Authorization')
  //     if (!Authorization || Authorization.replace('Bearer ', '').trim() !== AUTH_SECRET_KEY.trim())
  //       throw new Error('Error: 无访问权限 | No access rights')
  //     next()
  //   }
  //   catch (error) {
  //     res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
  //   }
  // }
  // else {
  //   next()
  // }
}

export { auth }
