const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productFamilySchema = new Schema({
  name: {
    type: String,
    required: true
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

productFamilySchema.plugin(uniqueValidator)

const ProductFamily = model('ProductFamily', productFamilySchema)

module.exports = ProductFamily
