const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const incidenceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dealership: {
    type: Schema.Types.ObjectId, 
    ref: 'Dealership'
  },
  installation: {
    type: Schema.Types.ObjectId, 
    ref: 'Installation'
  },
  incidenceType: {
    type: Schema.Types.ObjectId, 
    ref: 'IncidenceType'
  },
  status: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false,
    default: null
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

incidenceSchema.plugin(uniqueValidator)

const Incidence = model('Incidence', incidenceSchema)

module.exports = Incidence
