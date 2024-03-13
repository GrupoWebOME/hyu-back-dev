const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const providerSchema = new Schema({
  name: {
    type: String, 
    trim: true,
    unique: true,
    required: true
  },
  description: {
    type: String, 
  },
  phone: {
    type: String,
    default: null
  },
  nameP1: {
    type: String, 
    required: true
  },
  emailP1: {
    type: String,
    required: true,
    lowercase: true    
  },
  addressP1: {
    type: String, 
    required: true
  },
  nameP2: {
    type: String, 
    required: false
  },
  emailP2: {
    type: String,
    required: false,
    lowercase: true    
  },
  addressP2: {
    type: String, 
    required: false
  },
  withNotifications: {
    type: Boolean,
    default: true
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

providerSchema.plugin(uniqueValidator)

const Provider = model('Provider', providerSchema)

module.exports = Provider
