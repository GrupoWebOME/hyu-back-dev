const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blockSchema = new Schema({
    name: {type: String, 
           required: true,
           trim: true},
    value: {type: Number,
            default: 0},
    number: {type: Number,
             required: true},
    areas: [{type: Schema.Types.ObjectId, ref: 'Area'}],
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    isAgency: {type: Boolean,
               default: false },
    category_abbreviation: {type: String,
                            required: false},
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

blockSchema.plugin(uniqueValidator)

const Block = model('Block', blockSchema)

module.exports = Block
