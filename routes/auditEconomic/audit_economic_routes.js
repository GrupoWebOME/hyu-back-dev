const express = require('express')
const api = express.Router()
const AuditEconomic = require('../../controllers/auditEconomic/audit_economic_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

api.post('/find', authenticationAdmin.validate, AuditEconomic.getAllAuditEconomic)
api.post('/', authenticationAdmin.validate, AuditEconomic.createAuditEconomic)
api.put('/:id', authenticationAdmin.validate, AuditEconomic.updateAuditEconomic)
api.delete('/:id', authenticationAdmin.validate, AuditEconomic.deleteAuditEconomic)
 
module.exports = api
