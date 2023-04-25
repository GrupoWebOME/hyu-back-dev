const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditDealershipSchema = new Schema({
  audit_id: {type: Schema.Types.ObjectId, ref: 'Audit'},
  dealership_id: {type: Schema.Types.ObjectId, ref: 'Dealership'},
  ionic5_quaterly_billing: {type: Number, default: 0},
  vn_quaterly_billing: {type: Number, default: 0},
  electric_quaterly_billing: {type: Number, default: 0},
  createdAt: {type: Date,
    default: Date.now},
  updatedAt: {type: Date,
    default: Date.now}
})

auditDealershipSchema.plugin(uniqueValidator)

const AuditDealership = model('AuditDealership', auditDealershipSchema)

module.exports = AuditDealership
