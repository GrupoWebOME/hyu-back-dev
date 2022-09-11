const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditAgencySchema = new Schema({
    audit_id: {type: Schema.Types.ObjectId, ref: 'Audit'},
    dealership_id: {type: Schema.Types.ObjectId, ref: 'Dealership'},
    code: {type: String, required: true},
    name: {type: String, required: true},
    ionic5_quaterly_billing: {type: String, required: true},
    vn_quaterly_billing: {type: String, required: true},
    dealership_details: {},
    audit_criterions_details: [],
    audit_initial_date: {},
    audit_end_date: {},
    instalations_audit_details: [],
    agency_audit_details: {type: Number},
    agency_by_types: {},
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

auditAgencySchema.plugin(uniqueValidator)

const AuditAgency = model('AuditAgency', auditAgencySchema)

module.exports = AuditAgency
