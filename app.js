const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const fileUpload = require('express-fileupload')
require('dotenv').config()
require('./mongodb')
const api = require('./routes/routes')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cors({
  origin: (origin, cb) => {
    const allow = [
      'http://localhost:3000',
      'http://13.39.151.221:3000',
      'http://13.39.151.221',
      'https://13.39.151.221',
      'https://estandares.redhyundai.com',
    ]
    // origin puede venir undefined en llamadas server-to-server o Postman
    if (!origin || allow.includes(origin)) return cb(null, true)
    return cb(new Error(`CORS blocked origin: ${origin}`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(fileUpload())
app.use(cookieParser())
app.get('/', (request, response) => {response.status(200).json({msg: 'raiz'})})
app.use('/api', api)

app.use(notFound)

module.exports = app