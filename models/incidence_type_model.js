const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const incidenceTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  provider: {
    type: Schema.Types.ObjectId, 
    ref: 'Provider'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

incidenceTypeSchema.plugin(uniqueValidator)

const IncidenceType = model('IncidenceType', incidenceTypeSchema)

module.exports = IncidenceType
