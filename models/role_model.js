const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const roleSchema = new Schema({
  name: {type: String, 
    unique: true,
    trim: true,
    required: true},
  requirements: [{type: String, 
    trim: true,
    default: null }],
  weight: {type: Number, 
    default: 0},
  total_required: {type: Number, 
    default: 0},
  createdAt: {type: Date,
    default: Date.now},
  updatedAt: {type: Date,
    default: Date.now}
})

roleSchema.plugin(uniqueValidator)

const Role = model('Role', roleSchema)

module.exports = Role
