const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditResultsSchema = new Schema({
    audit_id: {type: Schema.Types.ObjectId, ref: 'Audit'},
    installation_id: {type: Schema.Types.ObjectId, ref: 'Installation', default: null},
    criterions: [{
        criterion_id: {type: Schema.Types.ObjectId, ref: 'Criterion'},
        pass: {type: Boolean, default: true},
        text: {
            type: String,
            default: null
        },
        images: [{
            type: String,
            default: null
        }],
    }],
    state: {
        type: String,
        default: 'created'
    },
    dateForAudit: {
        type: Date,
        default: null
    },
    instalations_audit_details: [],
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

auditResultsSchema.plugin(uniqueValidator)

const Audit = model('AuditResults', auditResultsSchema)

module.exports = Audit
