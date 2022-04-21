const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const installationSchema = new Schema({
        name: {type: String,
               required: true
              },
        autonomous_community: {type: String, 
                               default: null},
        code: {type: String,
                unique: true,
                required: true },
        address: {type: String,
                        required: true},
        dealership: {type: Schema.Types.ObjectId,
                     ref: 'Dealership',
                        required: true},
        installation_type: {type: Schema.Types.ObjectId, 
                            required: true,
                            ref: 'InstallationType'
                           },
        population: {type: String,
                     required: true},
        postal_code: {type: Number,
                      required: true},
        phone: {type: String,
                required: true},
        active: {type: Boolean,
                default: true},
        province: {type: String,
                   required: true},
        email: {type: String,
                required: true},
        latitude: {type: String,
                required: true},
        length: {type: Number,
                required: true},
        isSale: {type: Boolean,
                 default: false},
        isPostSale: {type: Boolean,
                     default: false},
        isHP: {type: Boolean,
               default: false},
        m2Exp: {type: Number,
                default: null},
        m2PostSale: {type: Number,
                     default: null},
        m2Rec: {type: Number,
                default: null},
        contacts: [{type: Schema.Types.ObjectId, 
                   ref: 'Personal'
                  }],
        createdAt: {type: Date,
                default: Date.now},
        updatedAt: {type: Date,
                default: Date.now}
})

installationSchema.plugin(uniqueValidator)

const Installation = model('Installation', installationSchema)

module.exports = Installation
