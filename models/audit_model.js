const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditSchema = new Schema({
    name: {type: String, 
           required: true,
           unique: true,
           trim: true},
    installation_type: [{type: Schema.Types.ObjectId, ref: 'InstallationType', default: null}],
    criterions: [{
        criterion: {type: Schema.Types.ObjectId, ref: 'Criterion'},
        exceptions: [{type: Schema.Types.ObjectId, ref: 'Installation'}]
    }],
    status: {
        type: String,
        default: 'created'
    },
    installation_exceptions: [{type: Schema.Types.ObjectId, ref: 'Installation'}],
    isAgency: {type: Boolean,
               default: false},
    initial_date: {type: Date,
                   default: null },
    end_date: {type: Date,
                default: null },
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

auditSchema.plugin(uniqueValidator)

const Audit = model('Audit', auditSchema)

module.exports = Audit
