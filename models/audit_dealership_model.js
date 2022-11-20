const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditDealershipSchema = new Schema({
    audit_id: {type: Schema.Types.ObjectId, ref: 'Audit'},
    dealership_id: {type: Schema.Types.ObjectId, ref: 'Dealership'},
    code: {type: String, required: true},
    name: {type: String, required: true},
    ionic5_quaterly_billing: {type: Number, default: null},
    vn_quaterly_billing: {type: Number, default: null},
    electric_quaterly_billing: {type: Number, default: null},
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

auditDealershipSchema.plugin(uniqueValidator)

const AuditDealership = model('AuditDealership', auditDealershipSchema)

module.exports = AuditDealership
