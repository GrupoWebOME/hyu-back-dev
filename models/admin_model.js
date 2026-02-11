const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const adminSchema = new Schema({
  names: {
    type: String,
    lowercase: true, 
    required: false,
    trim: true,
    select: false
  },
  surnames: {
    type: String,
    lowercase: true, 
    trim: true,
    required: false,
    select: false
  },
  emailAddress: {
    type: String, 
    unique: false,
    lowercase: true, 
    trim: true,
    required: false,
    select: false
  },
  secondaryEmailAddress: {
    type: String, 
    lowercase: true, 
    trim: true,
    required: false,
    select: false
  },
  userName: {
    type: String, 
    lowercase: true, 
    unique: true,
    trim: true,
    required: true
  },
  password: {
    type: String, 
    trim: true,
    select: false
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  audits: [
    {
      audit: {type: Schema.Types.ObjectId, ref: 'InstallationType', default: null},
      dealerships: [
        {
          dealership_id: {type: Schema.Types.ObjectId, ref: 'InstallationType', default: null},
          installations: [{type: Schema.Types.ObjectId, ref: 'InstallationType', default: null}]
        }
      ]
    }
  ],
  dealership: {type: Schema.Types.ObjectId,
    ref: 'Dealership',
    default: null },
  isMain: {type: Boolean, 
    default: false},
  createdAt: {type: Date,
    default: Date.now},
  updatedAt: {type: Date,
    default: Date.now}
})

adminSchema.plugin(uniqueValidator)

const Admin = model('Admin', adminSchema)

module.exports = Admin
