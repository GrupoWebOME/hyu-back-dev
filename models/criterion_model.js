const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const criterionSchema = new Schema({  
    description: {type: String,
                  trim: true,
                  required: true },
    number: {type: Number,
            required: true},
    value: {type: Number,
            required: true},
    comment: {type: String, default: null},
    installationType: [{type: Schema.Types.ObjectId, ref: 'InstallationType'}],
    standard: {type: Schema.Types.ObjectId, ref: 'Standard'},
    block: {type: Schema.Types.ObjectId, ref: 'Block'},
    area: {type: Schema.Types.ObjectId, ref: 'Area'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    auditResponsable: {type: Schema.Types.ObjectId, ref: 'AuditResponsable'},
    criterionType: {type: Schema.Types.ObjectId, ref: 'CriterionType'},
    isAgency: {type: Boolean,
                default: false },
    isException: {type: Boolean,
                  default: false },
    exceptions: [{type: Schema.Types.ObjectId}],
    isHmeAudit: {type: Boolean, default: false },
    hmeCode: {type: String, default: null},
    isImgAudit: {type: Boolean, default: false },
    imageUrl: {type: String, default: null},
    imageComment: {type: String, default: null},
    isElectricAudit: {type: Boolean, default: false },
    photo: {type: Boolean, default: false },
    saleCriterion: {type: Boolean, default: false },
    hmesComment: {type: String, default: null },
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

criterionSchema.plugin(uniqueValidator)

const Criterion = model('Criterion', criterionSchema)

module.exports = Criterion
