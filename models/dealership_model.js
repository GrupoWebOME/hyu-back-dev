const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const dealershipSchema = new Schema({
        name: { type: String,
                trim: true,
                unique: true,
                required: true },
        address: {type: String,
                        trim: true},
        code: {type: String,
                trim: true,
                required: true },
        installations: [{type: Schema.Types.ObjectId}],
        location: {type: String, 
                required: true},
        active: {type: Boolean,
                 default: true},
        province: {type: String,
                        required: true},
        autonomous_community: {type: String, 
                               default: null},
        postal_code: {type: Number,
                      required: true},
        name_surname_manager: {type: String, 
                               required: true},
        phone: {type: String,
                default: null},
        cif: {type: String,
                default: null},
        email: {type: String,
                default: null},
        previous_year_sales: {type: Number, 
                              default: 0},
        referential_sales: {type: Number, 
                            default: 0},
        post_sale_spare_parts_previous_year: {type: Number, 
                                              default: 0},
        post_sale_referential_spare_parts: {type: Number, 
                                            default: 0},
        post_sale_daily_income: {type: Number, 
                                 default: 0},
        vn_quaterly_billing: {type: Number, 
                                default: 0},
        electric_quaterly_billing: {type: Number, 
                                    default: 0},
        ionic5_quaterly_billing: {type: Number, 
                                  default: 0},
        createdAt: {type: Date,
                        default: Date.now},
        updatedAt: {type: Date,
                        default: Date.now}
})

dealershipSchema.plugin(uniqueValidator)

const Dealership = model('Dealership', dealershipSchema)

module.exports = Dealership
