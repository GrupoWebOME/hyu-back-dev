const express = require('express')
const apiAuditInstallation = express.Router()
const AuditInstallation = require('../../controllers/auditInstallation/auditInstallation_controller')

apiAuditInstallation.post('/', AuditInstallation.getAllAuditInstallation)

apiAuditInstallation.put('/:id', AuditInstallation.updateAuditInstallation)

 module.exports = apiAuditInstallation
