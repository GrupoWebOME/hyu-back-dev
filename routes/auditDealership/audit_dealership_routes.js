const express = require('express')
const api = express.Router()
const Audit = require('../../controllers/auditDealership/audit_dealership_controller')

api.get('/:id', Audit.getAllAuditDealership)
api.post('/', Audit.createAuditDealership)
api.put('/:id', Audit.updateAuditDealership)
api.delete('/:id', Audit.deleteAuditDealership)
 
module.exports = api
