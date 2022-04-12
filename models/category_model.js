const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const categorySchema = new Schema({
    name: {type: String, 
           required: true,
           trim: true},
    abbreviation: {type: String,
                   trim: true,
                   required: true },
    value: {type: Number,
            default: 0},
    blocks: [{type: Schema.Types.ObjectId, ref: 'Block'}],
    isAgency: {type: Boolean,
               default: false },
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

categorySchema.plugin(uniqueValidator)

const Category = model('Category', categorySchema)

module.exports = Category
