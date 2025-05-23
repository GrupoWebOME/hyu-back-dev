const Dealership = require('../../models/dealership_model')
const DealershipType = require('../../models/dealership_type_model')
const Installation = require('../../models/installation_schema')
const Audit = require('../../models/audit_model')
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')

const getAllDealership= async(request, response) => {
  try{
    const {name, address, province, pageReq} = request.body
    const page = !pageReq ? 0 : pageReq
    let skip = (page - 1) * 10
    const filter = {}
    if(name)
      filter['name'] = { $regex : new RegExp(name, 'i') }
    if(address)
      filter['address'] = { $regex : new RegExp(address, 'i') }
    if(province)
      filter['province'] = { $regex : new RegExp(province, 'i') }
    if(page === 0){
      const dealerships = await Dealership.find(filter).populate('type')
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      const data = {dealerships: dealerships, 
        totalPages: 1}
      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
    let countDocs = await Dealership.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)
    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, 
        msg: 'invalid page', 
        detail: `totalPages: ${countPage}`})
    const dealerships = await Dealership.find(filter).populate('type').skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    const data = {dealerships: dealerships, 
      totalPages: countPage}
    response.status(200).json({code: 200,
      msg: 'success',
      data: data })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
}

const createDealership = async(request, response) => {
  try{
    const { name, cif, code, address, location, province, postal_code, autonomous_community, phone, email, name_surname_manager, previous_year_sales, referential_sales, 
      post_sale_spare_parts_previous_year, post_sale_referential_spare_parts, vn_quaterly_billing, electric_quaterly_billing, ionic5_quaterly_billing, 
      post_sale_daily_income, dealer_ioniq5, type, standard_compliance_m2_main_exhibition, exclusive_independent_installation, supernova_fast_charger,
      standards_result, facade_with_glass_windows, exclusive_service_reception, hmes_value } = request.body
    let errors = []
    if (type && !ObjectId.isValid(type)) {
      errors.push({code: 400, 
        msg: 'invalid type',
        detail: 'invalid type'
      })
    }
    if (type && ObjectId.isValid(type)) {
      const typeFinded = await DealershipType.findById(type)
      if (!typeFinded) {
        errors.push({code: 400, 
          msg: 'invalid type',
          detail: 'invalid type'
        })
      }
    }
    if(!name || name.length < 1)
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'name is required'
      })
    else if(name){
      const existName = await Dealership.exists({name: { $regex : new RegExp(name, 'i') }})
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      if(existName)
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: `${name} is already in use`
        })
    }
    if(!code || code.length < 1)
      errors.push({code: 400, 
        msg: 'invalid code',
        detail: 'code is required'
      })
    if(address && address.length < 1)
      errors.push({code: 400, 
        msg: 'invalid address',
        detail: 'invalid address'
      })
    if(cif && cif.length < 1)
      errors.push({code: 400, 
        msg: 'invalid cif',
        detail: 'invalid cif'
      })
    if(autonomous_community && autonomous_community.length < 1)
      errors.push({code: 400, 
        msg: 'invalid autonomous_community',
        detail: 'invalid autonomous_community'
      })
    if(!location || location.length < 1)
      errors.push({code: 400, 
        msg: 'invalid location',
        detail: 'location is required'
      })
    if(!province || province.length < 1)
      errors.push({code: 400, 
        msg: 'invalid province',
        detail: 'province is required'
      })
                        
    if(!postal_code || postal_code.length < 1)
      errors.push({code: 400, 
        msg: 'invalid postal_code',
        detail: 'postal_code is required'
      })
    if(!phone || phone.length < 1)
      errors.push({code: 400, 
        msg: 'invalid phone',
        detail: 'phone is required'
      })
    if(!email || email.length < 1)
      errors.push({code: 400, 
        msg: 'invalid email',
        detail: 'email is required'
      })
    if(!name_surname_manager || name_surname_manager.length < 1)
      errors.push({code: 400, 
        msg: 'invalid name_surname_manager',
        detail: 'name_surname_manager is required'
      })
    if(previous_year_sales && typeof previous_year_sales !== 'number')
      errors.push({code: 400, 
        msg: 'invalid previous_year_sales',
        detail: 'previous_year_sales should be a number value'
      })           
                        
    if(referential_sales && typeof referential_sales !== 'number')
      errors.push({code: 400, 
        msg: 'invalid referential_sales',
        detail: 'referential_sales should be a number value'
      })   
    if(post_sale_spare_parts_previous_year && typeof post_sale_spare_parts_previous_year !== 'number')
      errors.push({code: 400, 
        msg: 'invalid post_sale_spare_parts_previous_year',
        detail: 'post_sale_spare_parts_previous_year should be a number value'
      })   
    if(post_sale_referential_spare_parts && typeof post_sale_referential_spare_parts !== 'number')
      errors.push({code: 400, 
        msg: 'invalid post_sale_referential_spare_parts',
        detail: 'post_sale_referential_spare_parts should be a number value'
      })   
                                                
    if(post_sale_daily_income && typeof post_sale_daily_income !== 'number')
      errors.push({code: 400, 
        msg: 'invalid post_sale_daily_income',
        detail: 'post_sale_daily_income should be a number value'
      })           
    if(vn_quaterly_billing && typeof vn_quaterly_billing !== 'number')
      errors.push({code: 400, 
        msg: 'invalid vn_quaterly_billing',
        detail: 'vn_quaterly_billing should be a number value'
      })   
    if(electric_quaterly_billing && typeof electric_quaterly_billing !== 'number')
      errors.push({code: 400, 
        msg: 'invalid electric_quaterly_billing',
        detail: 'electric_quaterly_billing should be a number value'
      })           
    if(ionic5_quaterly_billing && typeof ionic5_quaterly_billing !== 'number')
      errors.push({code: 400, 
        msg: 'invalid ionic5_quaterly_billing',
        detail: 'ionic5_quaterly_billing should be a number value'
      })   
    if(errors.length > 0)
      return response.status(400).json({errors: errors})
    const newDealership = new Dealership({
      name, 
      cif,
      code, 
      address, 
      location, 
      province, 
      postal_code, 
      phone, 
      email, 
      autonomous_community,
      name_surname_manager, 
      previous_year_sales, 
      referential_sales, 
      post_sale_spare_parts_previous_year, 
      post_sale_referential_spare_parts, 
      vn_quaterly_billing, 
      electric_quaterly_billing, 
      ionic5_quaterly_billing, 
      post_sale_daily_income,
      dealer_ioniq5: dealer_ioniq5? dealer_ioniq5: null,
      type: type ? type : null, 
      standard_compliance_m2_main_exhibition: standard_compliance_m2_main_exhibition ? standard_compliance_m2_main_exhibition : 0, 
      exclusive_independent_installation: exclusive_independent_installation ? exclusive_independent_installation : 0, 
      supernova_fast_charger: supernova_fast_charger ? supernova_fast_charger : 0,
      standards_result: standards_result ? standards_result: 0, 
      facade_with_glass_windows: facade_with_glass_windows ? facade_with_glass_windows : 0, 
      exclusive_service_reception: exclusive_service_reception ? exclusive_service_reception : 0, 
      hmes_value: hmes_value ? hmes_value : 0
    })
    await newDealership.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 201,
      msg: 'the Dealership has been created successfully',
      data: newDealership })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateDealership = async(request, response) => {
  try{
    const {name, cif, code, address, autonomous_community, location, province, postal_code, phone, email, name_surname_manager, previous_year_sales, 
      referential_sales, active, post_sale_spare_parts_previous_year, post_sale_referential_spare_parts, vn_quaterly_billing, electric_quaterly_billing, 
      ionic5_quaterly_billing, post_sale_daily_income, dealer_ioniq5, type, standard_compliance_m2_main_exhibition, exclusive_independent_installation, 
      supernova_fast_charger, standards_result, facade_with_glass_windows, exclusive_service_reception, hmes_value} = request.body
    const {id} = request.params
    let errors = []
    let dealerById = null
    if (type && !ObjectId.isValid(type)) {
      errors.push({code: 400, 
        msg: 'invalid type',
        detail: 'invalid type'
      })
    }
    if (type && ObjectId.isValid(type)) {
      const typeFinded = await DealershipType.findById(type)
      if (!typeFinded) {
        errors.push({code: 400, 
          msg: 'invalid type',
          detail: 'invalid type'
        })
      }
    }
    if(id && ObjectId.isValid(id)){
      dealerById = await Dealership.findById(id)
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error id',
          detail: error.message
        })} )  
      if(!dealerById)
        return response.status(400).json({code: 400, 
          msg: 'invalid id',
          detail: 'id not found'
        })
    }
    else{
      return response.status(400).json({code: 400, 
        msg: 'invalid id',
        detail: 'id not found'
      })   
    }
    if(name){
      if(name.length < 1)
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: 'name is empty'
        })
      const existName = await Dealership.exists({name: { $regex : new RegExp(name, 'i') }})
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      if(existName && dealerById.name !== name)
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: `${name} is already in use`
        })
    }
    if(code){
      if(code.length < 1)
        errors.push({code: 400, 
          msg: 'invalid code',
          detail: 'code is empty'
        })
    }
    if(address && address.length < 1)
      errors.push({code: 400, 
        msg: 'invalid address',
        detail: 'address is required'
      })
        
    if(cif && cif.length < 1)
      errors.push({code: 400, 
        msg: 'invalid cif',
        detail: 'cif is required'
      })
    if(autonomous_community && autonomous_community.length < 1)
      errors.push({code: 400, 
        msg: 'invalid autonomous_community',
        detail: 'invalid autonomous_community'
      })
    if(location && location.length < 1)
      errors.push({code: 400, 
        msg: 'invalid location',
        detail: 'location is required'
      })
    if(province && province.length < 1)
      errors.push({code: 400, 
        msg: 'invalid province',
        detail: 'province is required'
      })
    if(postal_code && postal_code.length < 1)
      errors.push({code: 400, 
        msg: 'invalid postal_code',
        detail: 'postal_code is required'
      })
    if(phone && phone.length < 1)
      errors.push({code: 400, 
        msg: 'invalid phone',
        detail: 'phone is required'
      })
    if(email && email.length < 1)
      errors.push({code: 400, 
        msg: 'invalid email',
        detail: 'email is required'
      })
    if(name_surname_manager && name_surname_manager.length < 1)
      errors.push({code: 400, 
        msg: 'invalid name_surname_manager',
        detail: 'name_surname_manager is required'
      })
                        
    if(previous_year_sales && typeof previous_year_sales !== 'number')
      errors.push({code: 400, 
        msg: 'invalid previous_year_sales',
        detail: 'previous_year_sales should be a number value'
      })           
                        
    if(referential_sales && typeof referential_sales !== 'number')
      errors.push({code: 400, 
        msg: 'invalid referential_sales',
        detail: 'referential_sales should be a number value'
      })   
    if(post_sale_spare_parts_previous_year && typeof post_sale_spare_parts_previous_year !== 'number')
      errors.push({code: 400, 
        msg: 'invalid post_sale_spare_parts_previous_year',
        detail: 'post_sale_spare_parts_previous_year should be a number value'
      })   
    if(post_sale_referential_spare_parts && typeof post_sale_referential_spare_parts !== 'number')
      errors.push({code: 400, 
        msg: 'invalid post_sale_referential_spare_parts',
        detail: 'post_sale_referential_spare_parts should be a number value'
      })   
    if(post_sale_daily_income && typeof post_sale_daily_income !== 'number')
      errors.push({code: 400, 
        msg: 'invalid post_sale_daily_income',
        detail: 'post_sale_daily_income should be a number value'
      })            
                        
    if(vn_quaterly_billing && typeof vn_quaterly_billing !== 'number')
      errors.push({code: 400, 
        msg: 'invalid vn_quaterly_billing',
        detail: 'vn_quaterly_billing should be a number value'
      })   
                        
    if(active !== undefined && active !== null && active !== true && active !== false)
      errors.push({code: 400, 
        msg: 'invalid active',
        detail: 'active should be a boolean'
      })                          

    if(electric_quaterly_billing && typeof electric_quaterly_billing !== 'number')
      errors.push({code: 400, 
        msg: 'invalid electric_quaterly_billing',
        detail: 'electric_quaterly_billing should be a number value'
      })   
    if(dealer_ioniq5 && typeof dealer_ioniq5 !== 'number')
      errors.push({code: 400, 
        msg: 'invalid dealer_ioniq5',
        detail: 'dealer_ioniq5 should be a number value'
      }) 
    if(ionic5_quaterly_billing && typeof ionic5_quaterly_billing !== 'number')
      errors.push({code: 400, 
        msg: 'invalid ionic5_quaterly_billing',
        detail: 'ionic5_quaterly_billing should be a number value'
      })   
    if(errors.length > 0)
      return response.status(400).json({errors: errors})
    const updatedFields = {}
    if(name)
      updatedFields['name'] = name
    if(cif)
      updatedFields['cif'] = cif
    if(address)
      updatedFields['address'] = address
    if(autonomous_community)
      updatedFields['autonomous_community'] = autonomous_community
    if(code)
      updatedFields['code'] = code
    if(location)
      updatedFields['location'] = location
    if(province)
      updatedFields['province'] = province
    if(postal_code)
      updatedFields['postal_code'] = postal_code
    if(phone)
      updatedFields['phone'] = phone
    if(active !== undefined && active !== null)
      updatedFields['active'] = active
    if(email)
      updatedFields['email'] = email
    if(name_surname_manager)
      updatedFields['name_surname_manager'] = name_surname_manager
    if(dealer_ioniq5)
      updatedFields['dealer_ioniq5'] = dealer_ioniq5
    if(previous_year_sales !== null && previous_year_sales !== undefined)
      updatedFields['previous_year_sales'] = previous_year_sales
    if(referential_sales !== null && referential_sales !== undefined)
      updatedFields['referential_sales'] = referential_sales
    if(post_sale_spare_parts_previous_year !== null && post_sale_spare_parts_previous_year !== undefined)
      updatedFields['post_sale_spare_parts_previous_year'] = post_sale_spare_parts_previous_year
    if(post_sale_referential_spare_parts !== null && post_sale_referential_spare_parts !== undefined)
      updatedFields['post_sale_referential_spare_parts'] = post_sale_referential_spare_parts
    if(vn_quaterly_billing !== null && vn_quaterly_billing !== undefined)
      updatedFields['vn_quaterly_billing'] = vn_quaterly_billing
    if(electric_quaterly_billing !== null && electric_quaterly_billing !== undefined)
      updatedFields['electric_quaterly_billing'] = electric_quaterly_billing
    if(ionic5_quaterly_billing !== null && ionic5_quaterly_billing !== undefined)
      updatedFields['ionic5_quaterly_billing'] = ionic5_quaterly_billing
    if(post_sale_daily_income !== null && post_sale_daily_income !== undefined)
      updatedFields['post_sale_daily_income'] = post_sale_daily_income
    if(type)
      updatedFields['type'] = type
    if(standard_compliance_m2_main_exhibition){
      updatedFields['standard_compliance_m2_main_exhibition'] = standard_compliance_m2_main_exhibition
    } else {
      updatedFields['standard_compliance_m2_main_exhibition'] = 0
    }
    if(exclusive_independent_installation){
      updatedFields['exclusive_independent_installation'] = exclusive_independent_installation
    } else {
      updatedFields['exclusive_independent_installation'] = 0
    }
    if(supernova_fast_charger){
      updatedFields['supernova_fast_charger'] = supernova_fast_charger
    }
    else {
      updatedFields['supernova_fast_charger'] = 0
    }
    if(standards_result){
      updatedFields['standards_result'] = standards_result
    }
    else {
      updatedFields['standards_result'] = 0
    }
    if(facade_with_glass_windows){
      updatedFields['facade_with_glass_windows'] = facade_with_glass_windows
    } else {
      updatedFields['facade_with_glass_windows'] = 0
    }
    if(exclusive_service_reception){
      updatedFields['exclusive_service_reception'] = exclusive_service_reception
    } else {
      updatedFields['exclusive_service_reception'] = 0
    }
    if(hmes_value){
      updatedFields['hmes_value'] = hmes_value
    } else {
      updatedFields['hmes_value'] = 0
    }

    updatedFields['updatedAt'] = Date.now()
    const updatedDealership = await Dealership.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 200,
      msg: 'the Dealership has been updated successfully',
      data: updatedDealership })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteDealership = async(request, response) => {
  try{
    const {id} = request.params
    if(id && ObjectId.isValid(id)){
      const existId = await Dealership.exists({_id: id})
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error id',
          detail: error.message
        })} )  
      if(!existId)
        return response.status(400).json({code: 400, 
          msg: 'invalid id',
          detail: 'id not found'
        })
    }
    else{
      return response.status(400).json({code: 400, 
        msg: 'invalid id',
        detail: 'id not found'
      })   
    }
    const deletedDealership = await Dealership.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    await Installation.deleteMany({dealership: id})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 201,
      msg: 'the Dealership has been deleted successfully',
      data: deletedDealership })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getDealership = async(request, response) => {
  try{
    const {id} = request.params
    if(!id)
      return response.status(400).json({code: 400,
        msg: 'invalid id',
        detail: 'id is a obligatory field'})
    if(id && !ObjectId.isValid(id))
      return response.status(400).json({code: 400,
        msg: 'invalid id',
        detail: 'id should be an objectId'})
    const block = await Dealership.findById(id).populate('type')
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    if(block){
      response.status(200).json({code: 200,
        msg: 'success',
        data: block})
    }
    else{
      response.status(200).json({code: 204,
        msg: 'not found',
        data: null})}
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
    
}

const getAllDealershipByAuditID = async(request, response) => {
  const {id} = request.params
  if(id && !ObjectId.isValid(id))
    return response.status(400).json({code: 400,
      msg: 'invalid id',
      detail: 'id should be an objectId'})
  const auditByID = await Audit.findById(id)
  const installations = await Installation.find({$and:[{installation_type: {$in: auditByID.installation_type}},{_id: {$nin: auditByID.installation_exceptions}}]}).populate({path: 'dealership', populate: {path: 'installations', select: '_id name code'}})
  let auxAudID = {}
  let arrayAgencies = []
  installations && installations.forEach((element) => {
    if(!auxAudID[element.dealership._id]){
      arrayAgencies = [...arrayAgencies, element.dealership]
      auxAudID[element.dealership._id] = element.dealership
    }
  })
  return response.status(200).json({data: arrayAgencies})
}

const geatAllDealershipWithInstallations = async(request, response) => {
  try {
    const authHeader = request.headers['authorization']
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      let decodedToken = null
      await jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err){
          decodedToken = false
          return response.status(401).json({error: 'Unauthorized'})
        }
        else{
          decodedToken = decoded
        }
      })

      if (decodedToken?.admin?.isMain) {
        const dealerships = await Dealership.find().sort({ name: 'asc' }).select('_id name installations').populate({path: 'installations', select: '_id name'})
        return response.status(200).json({ data: dealerships })
      } else if(decodedToken?.admin?.dealership) {
        const dealerships = await Dealership.find({_id: decodedToken?.admin?.dealership}).sort({ name: 'asc' }).select('_id name installations').populate({path: 'installations', select: '_id name'})
        return response.status(200).json({ data: dealerships })
      }
    }
    const dealerships = await Dealership.find().sort({ name: 'asc' }).select('_id name installations').populate({path: 'installations', select: '_id name'})
    return response.status(200).json({ data: dealerships })
  }catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  } 
}

module.exports = {
  getAllDealership, 
  createDealership, 
  updateDealership, 
  deleteDealership, 
  getDealership, 
  getAllDealershipByAuditID,
  geatAllDealershipWithInstallations
}
