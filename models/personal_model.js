const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const personalSchema = new Schema({
    name_and_surname: {type: String, 
                        trim: true,
                        required: true},
    dni: {type: String, 
            lowercase: true, 
            trim: true,
            required: true, 
            unique: true },
    address: {type: String, 
              default: null},
    email: {type: String,
            default: null,
            lowercase: true    
    },
    phone: {type: String,
            default: null},
    id_secondary: {type: String, 
                   unique: true},
    installation: {type: Schema.Types.ObjectId, 
                   required: true, 
                   ref: 'Installation'},
    dealership: {type: Schema.Types.ObjectId, 
                required: true, 
                ref: 'Dealership'},
    role: [{type: Schema.Types.ObjectId, 
           required: true, 
           ref: 'Role'}]
})

personalSchema.plugin(uniqueValidator)

const Personal = model('Personal', personalSchema)

module.exports = Personal
