const express = require('express')
const api = express.Router()
const AuditEconomic = require('../../controllers/auditEconomic/audit_economic_controller')

api.post('/find', AuditEconomic.getAllAuditEconomic)
api.post('/', AuditEconomic.createAuditEconomic)
api.put('/:id', AuditEconomic.updateAuditEconomic)
api.delete('/:id', AuditEconomic.deleteAuditEconomic)
 
module.exports = api
