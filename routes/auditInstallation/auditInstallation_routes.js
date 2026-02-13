const express = require('express')
const apiAuditInstallation = express.Router()
const AuditInstallation = require('../../controllers/auditInstallation/auditInstallation_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiAuditInstallation.post('/', authenticationAdmin.validate, AuditInstallation.getAllAuditInstallation)

apiAuditInstallation.put('/:id', authenticationAdmin.validate, AuditInstallation.updateAuditInstallation)

module.exports = apiAuditInstallation
