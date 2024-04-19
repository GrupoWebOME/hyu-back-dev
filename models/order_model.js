const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const orderSchema = new Schema({
  number: {
    type: String, 
    trim: true,
    unique: true,
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
  provider: {
    type: Schema.Types.ObjectId, 
    ref: 'Provider'
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId, 
        ref: 'Product'
      },
      count: {type: Number, required: true},
      price: {type: Number, required: true},
      pricePvpProd: {type: Number, required: true},
      pricePvpMan: {type: Number, required: false},
      family: {type: String, required: true },
      name: {type: String, required: true },
      photo: {type: String, required: false, default: null},
      isDelivered: {type: Boolean, required: false, default: false},
    }
  ],
  observations: {
    type: String,
    default: null,
  },
  orderNote: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: 'Solicitado'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

orderSchema.plugin(uniqueValidator)

const Order = model('Order', orderSchema)

module.exports = Order
