const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const areaSchema = new Schema({
    name: {type: String, 
           required: true,
           unique: true,
           trim: true},
    value: { type: Number,
            default: 0
            },
    description: {type: String,
                  trim: true,
                  required: true },
    isException: {type: Boolean},
    exceptions: [{type: Schema.Types.ObjectId}],
    number: {type: Number,
             required: true},
    standards: [{type: Schema.Types.ObjectId, ref: 'Standard'}],
    block: {type: Schema.Types.ObjectId, ref: 'Block'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    isAgency: {type: Boolean,
               default: false },
    area_abbreviation: {type: String,
                            required: false},
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

areaSchema.plugin(uniqueValidator)

const Area = model('Area', areaSchema)

module.exports = Area
