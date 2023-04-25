/* eslint-disable no-useless-escape */
const Personal = require('../../models/personal_model')
const Installation = require('../../models/installation_schema')
const Dealership = require('../../models/dealership_model')
const Role = require('../../models/role_model')
const ObjectId = require('mongodb').ObjectId

const createPersonal = async(request, response) => {
  try{
    const {name_and_surname, dni, address, id_secondary, installation, dealership, role, email, phone} = request.body

    let errors = []

    const regExPatternEmailAddress= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if(email && !email.match(regExPatternEmailAddress))
      errors.push({code: 400, 
        msg: 'invalid email',
        detail: `${email} is not valid email format. The email field can only contain a valid email`
      })
    else if(email){
      const personalExist = await Personal.findOne({email: email.toLowerCase()})
      if(personalExist)
        errors.push({code: 400, 
          msg: 'invalid email',
          detail: `${email} is in use`
        })
    }

    if(!id_secondary){
      errors.push({code: 400, 
        msg: 'invalid id_secondary',
        detail: 'id_secondary is required'
      })  
    }
    else if(id_secondary){
      const existSecondaryId = await Personal.findOne({id_secondary: { $regex : new RegExp(id_secondary, 'i') }})
      if(existSecondaryId){
        errors.push({code: 400, 
          msg: 'invalid id_secondary',
          detail: 'id_secondary already exist'
        })  
      }
    }

    if(!role || !Array.isArray(role) || role.length === 0){
      errors.push({code: 400, 
        msg: 'invalid role',
        detail: 'role is required, and should be Array format'
      })  
    }
    else{
      await role.forEach(async(elem) => {
        if(!ObjectId.isValid(elem.toString())){
          errors.push({code: 400, 
            msg: 'invalid role',
            detail: `${elem} is not a objectId`
          })  
        }
        const existRole = await Role.findById(elem)
        if(!existRole){
          errors.push({code: 400, 
            msg: 'invalid role',
            detail: `${elem} not found`
          })  
        }
      })
    }

    if(!installation || (installation && !ObjectId.isValid(installation))){
      errors.push({code: 400, 
        msg: 'invalid installation',
        detail: 'installation is required'
      })  
    }
    else if(installation && ObjectId.isValid(installation)){
      const existInstallation = await Installation.findById(installation)
      if(!existInstallation){
        errors.push({code: 400, 
          msg: 'invalid installation',
          detail: 'installation not found'
        })  
      }
    }

    if(!dealership || (dealership && !ObjectId.isValid(dealership))){
      errors.push({code: 400, 
        msg: 'invalid dealership',
        detail: 'dealership is required'
      })  
    }

    if(dealership && ObjectId.isValid(dealership)){
      const existDealership = await Dealership.findById(dealership)
      if(!existDealership){
        errors.push({code: 400, 
          msg: 'invalid dealership',
          detail: 'dealership not found'
        })  
      }
    }
        
    if(!name_and_surname || name_and_surname.length < 1)
      errors.push({code: 400, 
        msg: 'invalid name_and_surname',
        detail: 'name_and_surname is required'
      })  
        
    if(phone && phone.length < 1)
      errors.push({code: 400, 
        msg: 'invalid phone',
        detail: 'phone is required'
      }) 
        
    if(!dni)
      errors.push({code: 400, 
        msg: 'invalid dni',
        detail: 'dni is required'
      })  

    if(dni){
      const existDni = await Personal.findOne({dni: { $regex : new RegExp(dni, 'i') }})
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error dni',
          detail: error.message
        })} )  

      if(existDni)
        return response.status(400).json({code: 400, 
          msg: 'invalid dni',
          detail: 'dni already exist'
        })
    }

    if(address && address.length<1)
      errors.push({code: 400, 
        msg: 'invalid address',
        detail: 'address is invalid'
      })

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const newPersonal = new Personal({
      name_and_surname, 
      dni, 
      address, 
      id_secondary, 
      installation, 
      dealership,
      role,
      email
    })

    await newPersonal.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({code: 201,
      msg: 'the newPersonal has been created successfully',
      data: newPersonal })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updatePersonal = async(request, response) => {
  try{
    const {id} = request.params
    const {name_and_surname, dni, address, id_secondary, installation, dealership, role, email, phone} = request.body

    let errors = []

    const regExPatternEmailAddress= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if(email && !email.match(regExPatternEmailAddress))
      errors.push({code: 400, 
        msg: 'invalid email',
        detail: `${email} is not valid email format. The email field can only contain a valid email`
      })
    else{
      const personalExist = await Personal.findOne({email: email.toLowerCase()})
      if(personalExist && personalExist._id.toString() !== id)
        errors.push({code: 400, 
          msg: 'invalid email',
          detail: `${email} is in use`
        })
    }
        
    if(id && ObjectId.isValid(id)){
      const existId = await Personal.findById(id)
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

    if(dealership && ObjectId.isValid(dealership)){
      const existDealership = await Dealership.findById(dealership)
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error dealership',
          detail: error.message
        })} )  

      if(!existDealership)
        return response.status(400).json({code: 400, 
          msg: 'invalid dealership',
          detail: 'id not found'
        })
    }
    else{
      return response.status(400).json({code: 400, 
        msg: 'invalid dealership',
        detail: 'dealership not found'
      })   
    }

    if(installation && ObjectId.isValid(installation)){
      const existInstallation = await Installation.findById(installation)
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error installation',
          detail: error.message
        })} )  

      if(!existInstallation)
        return response.status(400).json({code: 400, 
          msg: 'invalid installation',
          detail: 'id not found'
        })
    }
    else{
      return response.status(400).json({code: 400, 
        msg: 'invalid installation',
        detail: 'installation not found'
      })   
    }

    if(phone && phone.length < 1)
      errors.push({code: 400, 
        msg: 'invalid phone',
        detail: 'phone is required'
      }) 
        
    if(role){
      if(!Array.isArray(role) || role.length === 0){
        return response.status(400).json({code: 400, 
          msg: 'invalid role',
          detail: 'role should be an Array'
        })  
      }
      await role.forEach(async(elem) => {
        if(!ObjectId.isValid(elem.toString())){
          errors.push({code: 400, 
            msg: 'invalid role',
            detail: `${elem} is not a objectId`
          })  
        }
        const existRole = await Role.findById(elem)
        if(!existRole){
          errors.push({code: 400, 
            msg: 'invalid role',
            detail: `${elem} not found`
          })  
        }
      })
    }

    if(dni){
      const existDni = await Personal.findOne({dni: { $regex : new RegExp(dni, 'i') }})
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error dni',
          detail: error.message
        })} )  
      if(!existDni)
        return response.status(400).json({code: 400, 
          msg: 'invalid dni',
          detail: 'dni not found'
        })
    }
        
    if(id_secondary){
      const existSecondaryId = await Personal.findOne({id_secondary: { $regex : new RegExp(id_secondary, 'i') }})
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error id_secondary',
          detail: error.message
        })} )  

      if(!existSecondaryId)
        return response.status(400).json({code: 400, 
          msg: 'invalid id_secondary',
          detail: 'id_secondary not found'
        })
    }

    if(name_and_surname && name_and_surname.length < 1)
      errors.push({code: 400, 
        msg: 'invalid name_and_surname',
        detail: 'invalid name_and_surname format'
      })

    if(address && address.length < 1){
      errors.push({code: 400, 
        msg: 'invalid address',
        detail: 'invalid address format'
      })
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const updatedFields = {}

    if(name_and_surname)
      updatedFields['name_and_surname'] = name_and_surname
    if(dni)
      updatedFields['dni'] = dni
    if(phone)
      updatedFields['phone'] = phone
    if(address)
      updatedFields['address'] = address
    if(id_secondary)
      updatedFields['id_secondary'] = id_secondary
    if(installation)
      updatedFields['installation'] = installation
    if(dealership)
      updatedFields['dealership'] = dealership
    if(role)
      updatedFields['role'] = role
    if(email)
      updatedFields['email'] = email

    updatedFields['updatedAt'] = Date.now()

    const updatedPersonal = await Personal.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({code: 200,
      msg: 'the Personal has been updated successfully',
      data: updatedPersonal })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getAllPersonal = async(request, response) => {
  try{
    const {name_and_surname, dni, address, id_secondary, installation, dealership, pageReq } = request.body

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(name_and_surname)
      filter['name_and_surname'] = { $regex : new RegExp(name_and_surname, 'i') }

    if(dni)
      filter['dni'] = { $regex : new RegExp(dni, 'i') }

    if(address)
      filter['address'] = { $regex : new RegExp(address, 'i') }

    if(id_secondary)
      filter['id_secondary'] = { $regex : new RegExp(id_secondary, 'i') }

    if(installation)
      filter['installation'] = installation

    if(dealership)
      filter['dealership'] = dealership

    if(page === 0){
      const personal = await Personal.find(filter).populate({path: 'installation dealership role'})
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      const data = {personal: personal, 
        totalPages: 1}

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await Personal.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const personal = await Personal.find(filter).skip(skip).limit(10).populate({path: 'installation dealership role'})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const data = {personals: personal, 
      totalPages: countPage}

    response.status(200).json({code: 200,
      msg: 'success',
      data: data })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
}

const getPersonal = async(request, response) => {

  try{
    const {id} = request.params

    //Validations
    if(!id)
      return response.status(400).json({code: 400,
        msg: 'invalid id',
        detail: 'id is a obligatory field'})
    
    if(id && !ObjectId.isValid(id))
      return response.status(400).json({code: 400,
        msg: 'invalid id',
        detail: 'id should be an objectId'})
    
    const personal = await Personal.findById(id).populate({path: 'installation dealership role'})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(personal){
      response.status(200).json({code: 200,
        msg: 'success',
        data: personal})
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

const deletePersonal = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await Personal.exists({_id: id})
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

    const deletePersonal = await Personal.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the Personal has been deleted successfully',
      data: deletePersonal })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

module.exports = {getAllPersonal, createPersonal, getPersonal, updatePersonal, deletePersonal}
