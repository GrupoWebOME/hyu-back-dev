const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: null
  },
  price: {
    type: Number,
    default: 0
  },
  pricePvpProd: {
    type: Number,
    default: 0
  },
  pricePvpMan: {
    type: Number,
    default: 0
  },
  provider: {
    type: Schema.Types.ObjectId, 
    ref: 'Provider'
  },
  photo: {
    type: String,
    default: null
  },
  productFamily: {
    type: Schema.Types.ObjectId, 
    ref: 'ProductFamily'
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

productSchema.plugin(uniqueValidator)

const Product = model('Product', productSchema)

module.exports = Product
