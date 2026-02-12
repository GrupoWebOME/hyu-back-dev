const jwt = require('jsonwebtoken')

const unauthorized = (res, detail = 'you do not have permissions') =>
  res.status(401).json({
    code: 401,
    msg: 'invalid credentials',
    detail,
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
    if (!token) return unauthorized(res, 'missing token')

    // Verifica firma + expiración (si hay exp)
    const decoded = jwt.verify(token, process.env.SECRET)

    // Hardening: exigir que tenga exp (porque vos generás con expiresIn)
    // Si algún token viejo no tiene exp, lo tratás como inválido.
    if (!decoded || typeof decoded !== 'object' || !decoded.exp) {
      return unauthorized(res, 'invalid token payload')
    }

    // Chequeo extra explícito (redundante, pero deja claro el comportamiento)
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp <= now) {
      return unauthorized(res, 'token expired')
    }

    // (Opcional) validar estructura mínima esperada
    if (!decoded.admin || !decoded.admin._id || !decoded.admin.role) {
      return unauthorized(res, 'invalid token claims')
    }

    req.jwt = decoded
    return next()
  } catch (e) {
    // Diferenciar expirado vs inválido
    if (e && e.name === 'TokenExpiredError') {
      return unauthorized(res, 'token expired')
    }
    if (e && e.name === 'JsonWebTokenError') {
      return unauthorized(res, 'invalid token')
    }
    return unauthorized(res, 'invalid token')
  }
}

module.exports = { validate }
