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
    default: null,
    select: false
  },
  nameP1: {
    type: String, 
    required: false,
    select: false
  },
  emailP1: {
    type: String,
    required: false,
    lowercase: true    ,
    select: false
  },
  nameP2: {
    type: String, 
    required: false,
    select: false
  },
  emailP2: {
    type: String,
    required: false,
    lowercase: true    ,
    select: false
  },
  withNotifications: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
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
