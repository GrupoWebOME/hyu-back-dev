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
  installations: [{type: Schema.Types.ObjectId, 
    ref: 'Installation'}],
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
  type: { type: Schema.Types.ObjectId, ref: 'DealershipType' },
  standard_compliance_m2_main_exhibition: {type: Number},
  exclusive_independent_installation: {type: Number},
  supernova_fast_charger: {type: Number},
  standards_result: {type: Number},
  facade_with_glass_windows: {type: Number},
  exclusive_service_reception: {type: Number},
  hmes_value: {type: Number},
  post_sale_spare_parts_previous_year: {type: Number},
  post_sale_referential_spare_parts: {type: Number},
  post_sale_daily_income: {type: Number},
  vn_quaterly_billing: {type: Number},
  electric_quaterly_billing: {type: Number},
  ionic5_quaterly_billing: {type: Number},
  dealer_ioniq5: {type: Number},
  createdAt: {type: Date,
    default: Date.now},
  updatedAt: {type: Date,
    default: Date.now}
})

dealershipSchema.plugin(uniqueValidator)

const Dealership = model('Dealership', dealershipSchema)

module.exports = Dealership
