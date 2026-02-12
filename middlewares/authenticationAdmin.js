const jwt = require('jsonwebtoken')

const unauthorized = (res) =>
  res.status(401).json({
    code: 401,
    msg: 'invalid credentials',
    detail: 'you do not have permissions',
  })

const stripBearer = (value) => {
  if (!value) return null
  const s = String(value).trim()
  return s.toLowerCase().startsWith('bearer ') ? s.slice(7).trim() : s
}

const validate = (req, res, next) => {
  try {
    const headerToken = stripBearer(req.headers.authorization)
    const cookieToken = stripBearer(req.cookies?.token)

    const token = headerToken || cookieToken
    if (!token) return unauthorized(res)

    const decoded = jwt.verify(token, process.env.SECRET)

    req.jwt = decoded
    return next()
  } catch (e) {
    return unauthorized(res)
  }
}

module.exports = { validate }
