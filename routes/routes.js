const express = require('express')
const api = express.Router()
const apiAdmin = require('./admin/admin_routes')
const apiCategory = require('./category/category_routes')
const apiBlock = require('./block/block_routes')
const apiArea = require('./area/area_routes')
const apiStandard = require('./standard/standard_routes')
const apiCriterion = require('./criterion/criterion_routes')
const apiInstallationType = require('./installationType/installationType_routes')
const apiCriterionType = require('./criterionType/criterionType_routes')
const apiAuditResponsable = require('./auditResponsable/auditResponsable_routes')
const apiInstallation = require('./installation/installation_routes')
const apiDealership = require('./dealership/dealership_routes')
const apiRole = require('./role/role_routes')
const apiPersonal = require('./personal/personal_routes')
const apiAudit = require('./audit/audit_routes')
const apiCloudinary = require('./cloudinary/cloudinary_routes')
const apiImages = require('./images/images_routes')
const apiSizingTable = require('./sizingTable/sizingtable_routes')
const apiAuditResults = require('./auditResults/auditResults_routes')
const apiAuditInstallation = require('./auditInstallation/auditInstallation_routes')
const apiAuditDealership = require('./auditDealership/audit_dealership_routes')
const apiAuditEconomic = require('./auditEconomic/audit_economic_routes')
const apiSwagger = require('./doc/doc_routes')

api.get('/', (request, response) => {
  response.status(200).json({msg: 'api'})
})

api.use('/admin', apiAdmin)
api.use('/category', apiCategory)
api.use('/block', apiBlock)
api.use('/area', apiArea)
api.use('/standard', apiStandard)
api.use('/criterion', apiCriterion)
api.use('/dealership', apiDealership)
api.use('/installationType', apiInstallationType)
api.use('/criterionType', apiCriterionType)
api.use('/auditResponsable', apiAuditResponsable)
api.use('/installation', apiInstallation)
api.use('/role', apiRole)
api.use('/personal', apiPersonal)
api.use('/audit', apiAudit)
api.use('/cloudinary', apiCloudinary)
api.use('/upload-images', apiImages)
api.use('/sizingTable', apiSizingTable)
api.use('/auditResults', apiAuditResults)
api.use('/auditInstallation', apiAuditInstallation)
api.use('/auditDealership', apiAuditDealership)
api.use('/auditEconomic', apiAuditEconomic)
api.use('/doc', apiSwagger)

module.exports = api
