
const express = require('express')
const api = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const {swaggerSpecification} = require('../../utils/swagger.config')

api.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpecification)))

module.exports = api
