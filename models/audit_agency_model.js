const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditAgencySchema = new Schema({
  audit_id: {type: Schema.Types.ObjectId, ref: 'Audit'},
  dealership_id: {type: Schema.Types.ObjectId, ref: 'Dealership'},
  code: {type: String, required: true},
  name: {type: String, required: true},
  ionic5_quaterly_billing: {type: String, default: null},
  vn_quaterly_billing: {type: String, default: null},
  dealership_details: {},
  audit_criterions_details: [
    {
      _id: {type: Schema.Types.ObjectId},
      audit_id: {type: Schema.Types.ObjectId},
      installation_id: {},
      criterions: [{
        criterion_id: {type: Schema.Types.ObjectId, ref: 'Criterion'},
        pass: {type: Boolean},
        text: {type: String},
        images: [],
        audited: {type: Boolean},
        discussion: [],
        state: {},
        _id: {type: Schema.Types.ObjectId}
      }],
      dateForAudit: {},
      instalations_audit_details: {},
      createdAt: {},
      updatedAt: {}
    }
  ],
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
