const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const adminSchema = new Schema({
       names: {type: String,
              lowercase: true, 
              required: true,
              trim: true },
       surnames: {type: String,
                     lowercase: true, 
                     trim: true,
                     required: true},
       emailAddress: {type: String, 
                     unique: true,
                     lowercase: true, 
                     trim: true,
                     required: true},
       userName: {type: String, 
                     lowercase: true, 
                     unique: true,
                     trim: true,
                     required: true },
       password: {type: String, 
                     trim: true},
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