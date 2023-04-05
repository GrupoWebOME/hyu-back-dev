const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const fileUpload = require('express-fileupload')
require('dotenv').config()
require('./mongodb')
const api = require('./routes/routes')

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.get('/', (request, response) => {response.status(200).json({msg: "raiz"})})
app.use('/api', api)

app.use(notFound)

module.exports = app