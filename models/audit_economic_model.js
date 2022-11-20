const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditEconomicSchema = new Schema({
    audit_id: {type: Schema.Types.ObjectId, ref: 'Audit'},
    dealership_id: {type: Schema.Types.ObjectId, ref: 'Dealership'},
    ionic5_quaterly_billing: {type: Number, default: 0},
    vn_quaterly_billing: {type: Number, default: 0},
    electric_quaterly_billing: {type: Number, default: 0},
    aCobrarVN: {type: Number, default: 0},
    perdidoVN: {type: Number, default: 0},
    retenidoVN: {type: Number, default: 0},
    aCobrarVE: {type: Number, default: 0},
    perdidoVE: {type: Number, default: 0},
    retenidoVE: {type: Number, default: 0},
    variableVNaCobrar: {type: Number, default: 0},
    variableVNperdido: {type: Number, default: 0},
    variableVNretenido: {type: Number, default: 0},
    variableElectricoACobrar: {type: Number, default: 0},
    variableElectricoPerdido: {type: Number, default: 0},
    variableElectricoRetenido: {type: Number, default: 0},
    variableIonic5Acobrar: {type: Number, default: 0},
    smartDealerPolicy: {type: Number, default: 0},
    variableTotalAcobrar: {type: Number, default: 0},
    aCobrarIoniq5: {type: Number, default: 100},
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

auditEconomicSchema.plugin(uniqueValidator)

const AuditEconomic = model('AuditEconomic', auditEconomicSchema)

module.exports = AuditEconomic
