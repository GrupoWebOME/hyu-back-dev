const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const auditResponsableTypeSchema = new Schema({
    idSecondary: {type: String,
                  unique: true,
                  trim: true },   
    name: {type: String, 
           required: true,
           unique: true,
           trim: true},
    criterions: [{type: Schema.Types.ObjectId, ref: 'Criterion'}],
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

auditResponsableTypeSchema.plugin(uniqueValidator)

const AuditResponsable = model('AuditResponsable', auditResponsableTypeSchema)

module.exports = AuditResponsable