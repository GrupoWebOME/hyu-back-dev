const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const installationTypeSchema = new Schema({
    idSecondary: {type: String,
                  unique: true,
                  trim: true },   
    name: {type: String, 
           required: true,
           unique: true,
           trim: true},
    code: {type: String, 
            required: true,
            unique: true,
            trim: true},
    criterions: [{type: Schema.Types.ObjectId}],
    createdAt: {type: Date,
                default: Date.now},
    updatedAt: {type: Date,
                default: Date.now}
})

installationTypeSchema.plugin(uniqueValidator)

const InstallationType= model('InstallationType', installationTypeSchema)

module.exports = InstallationType