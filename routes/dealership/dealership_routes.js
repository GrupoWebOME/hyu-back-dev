const express = require('express')
const api = express.Router()
const Dealership = require('../../controllers/dealership/dealership_controller')
// const authenticationAdminMain = require('../../middlewares/authenticationAdminMain')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

api.get('/dealershipWithInstallations', authenticationAdmin.validate, Dealership.geatAllDealershipWithInstallations)
api.get('/:id', Dealership.getDealership)
api.post('/all', authenticationAdmin.validate, Dealership.getAllDealership)
api.post('/', authenticationAdmin.validate, Dealership.createDealership)
api.put('/:id', authenticationAdmin.validate, Dealership.updateDealership)
api.delete('/:id', authenticationAdmin.validate, Dealership.deleteDealership)
api.get('/audit/:id', authenticationAdmin.validate, Dealership.getAllDealershipByAuditID)

module.exports = api
