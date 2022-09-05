const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditResultsSchema = new Schema({
    audit_id: {type: Schema.Types.ObjectId, ref: 'Audit'},
    installation_id: {type: Schema.Types.ObjectId, ref: 'Installation', default: null},
    criterions: [{
        criterion_id: {type: Schema.Types.ObjectId, ref: 'Criterion'},
        pass: {type: Boolean, default: true}
    }],
    state: {
        type: String,
        default: 'created'
    },
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

auditResultsSchema.plugin(uniqueValidator)

const Audit = model('AuditResults', auditResultsSchema)

module.exports = Audit
