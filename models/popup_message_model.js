const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const popUpMessageSchema = new Schema({
  name: {type: String,
    lowercase: true, 
    required: true,
    trim: true },
  message: {type: String,
    trim: true,
    required: true},
  active: {
    type: Boolean,
    required: false,
    default: true,
  },
  createdAt: {type: Date,
    default: Date.now},
  updatedAt: {type: Date,
    default: Date.now}
})

popUpMessageSchema.plugin(uniqueValidator)

const PopUpMessage = model('PopUpMessage', popUpMessageSchema)

module.exports = PopUpMessage
