const express = require('express')
const api = express.Router()
const Audit = require('../../controllers/auditDealership/audit_dealership_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

api.get('/:id', authenticationAdmin.validate, Audit.getAllAuditDealership)
api.post('/', authenticationAdmin.validate, Audit.createAuditDealership)
api.put('/:id', authenticationAdmin.validate, Audit.updateAuditDealership)
api.delete('/:id', authenticationAdmin.validate, Audit.deleteAuditDealership)
 
module.exports = api
