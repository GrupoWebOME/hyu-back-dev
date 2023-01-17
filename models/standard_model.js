const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const standardSchema = new Schema({
    description: {type: String,
                  trim: true,
                  required: true },
    value: { type: Number,
             default: 0
            },
    isException: {type: Boolean, default: false},
    exceptions: [{type: Schema.Types.ObjectId}],
    comment: {type: String, default: null},
    isCore: {type: Boolean, default: false},
    number: {type: Number,
             required: true},
    criterions: [{type: Schema.Types.ObjectId, ref: 'Criterion'}],
    area: {type: Schema.Types.ObjectId, ref: 'Area'},
    block: {type: Schema.Types.ObjectId, ref: 'Block'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    isAgency: {type: Boolean,
               default: false },
    standard_abbreviation: {type: String,
                        required: false},
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

standardSchema.plugin(uniqueValidator)

const Standard = model('Standard', standardSchema)

module.exports = Standard
