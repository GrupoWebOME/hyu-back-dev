const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const dealershipTypeSchema = new Schema({
  name: { type: String,
    trim: true,
    unique: true,
    required: true },
  description: { type: String,
    trim: true,
    unique: true,
    required: true },
  min_value: {type: Number, 
    required: true},
  max_value: {type: Number, 
    required: true},
  coefficient: {type: Number, 
    required: true},
  createdAt: {type: Date,
    default: Date.now},
  updatedAt: {type: Date,
    default: Date.now}
})

dealershipTypeSchema.plugin(uniqueValidator)

const dealershipType = model('DealershipType', dealershipTypeSchema)

module.exports = dealershipType