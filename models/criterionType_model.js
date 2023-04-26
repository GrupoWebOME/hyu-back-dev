const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const criterionTypeSchema = new Schema({
  idSecondary: {type: String,
    unique: true,
    trim: true },   
  name: {type: String, 
    required: true,
    unique: true,
    trim: true},
  criterions: [{type: Schema.Types.ObjectId}],
  rules: [{type: Schema.Types.ObjectId}],
  createdAt: {type: Date,
    default: Date.now},
  updatedAt: {type: Date,
    default: Date.now}
})

criterionTypeSchema.plugin(uniqueValidator)

const CriterionType = model('CriterionType', criterionTypeSchema)

module.exports = CriterionType