const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditInstallationSchema = new Schema({
       installation_id: {
              type: Schema.Types.ObjectId, 
              ref: 'Installation', 
              required: true
       },
       dealership_id: {
              type: Schema.Types.ObjectId, 
              ref: 'Dealership', 
              required: true
       },
       audit_id: {
              type: Schema.Types.ObjectId, 
              ref: 'Audit', 
              required: true
       },
       auditor_id: [{
              type: Schema.Types.ObjectId, 
              ref: 'Admin'
       }],
       comment: {
              type: String, 
              required: false
       },
       photo: {
              type: String, 
              required: false
       },
       audit_status: {
              type: String, 
              trim: true
       },
       audit_date: {
              type: Date,
              default: null
       },
       createdAt: {
              type: Date,
              default: Date.now
       },
       updatedAt: {
              type: Date,
              default: Date.now
       }
})

auditInstallationSchema.plugin(uniqueValidator)

const AuditInstallation = model('AuditInstallation', auditInstallationSchema)

module.exports = AuditInstallation
