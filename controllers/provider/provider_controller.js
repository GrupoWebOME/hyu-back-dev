const Provider = require('../../models/provider_model')
const { regExPatternEmailAddress } = require('../../utils/constants/regex')
const ObjectId = require('mongodb').ObjectId

const createProvider = async(request, response) => {
  try {
    const { name, description, nameP1, nameP2, addressP1, addressP2, emailP1, emailP2, phone, withNotifications } = request.body
    let errors = []

    if(!emailP1 || !emailP1.match(regExPatternEmailAddress))
      errors.push({code: 400, 
        msg: 'invalid email',
        detail: `${emailP1} is not valid email format. The email field can only contain a valid email P1`
      })

    if(emailP2 && !emailP2.match(regExPatternEmailAddress))
      errors.push({code: 400, 
        msg: 'invalid email',
        detail: `${emailP2} is not valid email format. The email field can only contain a valid email P2`
      })

    if (!name) {
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'name is a required field'
      })
    } else {
      const existName = await Provider.findOne({ name})
      if (existName) {
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: 'The name already exists'
        })
      }
    }

    if (!nameP1) {
      errors.push({code: 400, 
        msg: 'invalid nameP1',
        detail: 'nameP1 is a required field'
      })
    }

    if (!addressP1) {
      errors.push({code: 400, 
        msg: 'invalid addressP1',
        detail: 'addressP1 is a required field'
      })
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const newProvider = new Provider({
      name, 
      description, 
      nameP1, 
      nameP2, 
      addressP1,
      addressP2, 
      emailP1, 
      emailP2, 
      phone, 
      withNotifications
    })

    await newProvider.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 201,
      msg: 'the Provider has been created successfully',
      data: newProvider
    })
  }
  catch(error) {
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateProvider = async(request, response) => {
  try{
    const {id} = request.params
    const { name, description, nameP1, nameP2, addressP1, addressP2, emailP1, emailP2, phone, withNotifications } = request.body

    let errors = []

    if(name){
      const providerExist = await Provider.findOne({name: name})
      if(providerExist && providerExist?._id?.toString() !== id.toString())
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: `${name} is in use`
        })
    }

    if(emailP1 && !emailP1.match(regExPatternEmailAddress))
      errors.push({code: 400, 
        msg: 'invalid email',
        detail: `${emailP1} is not valid email format. The email field can only contain a valid email`
      })

    if(emailP2 && !emailP2.match(regExPatternEmailAddress))
      errors.push({code: 400, 
        msg: 'invalid email',
        detail: `${emailP2} is not valid email format. The email field can only contain a valid email`
      })
        
    if(id && ObjectId.isValid(id)){
      const existId = await Provider.findById(id)
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

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const updatedFields = {}
    if(name)
      updatedFields['name'] = name
    if(description)
      updatedFields['description'] = description
    if(nameP1)
      updatedFields['nameP1'] = nameP1
    if(nameP2)
      updatedFields['nameP2'] = nameP2
    if(addressP1)
      updatedFields['addressP1'] = addressP1
    if(addressP2)
      updatedFields['addressP2'] = addressP2
    if(emailP1)
      updatedFields['emailP1'] = emailP1
    if(emailP2)
      updatedFields['emailP2'] = emailP2
    if(phone)
      updatedFields['phone'] = phone
    if(withNotifications === false || withNotifications === true)
      updatedFields['withNotifications'] = withNotifications
    updatedFields['updatedAt'] = Date.now()

    const updatedProvider = await Provider.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 200,
      msg: 'the Provider has been updated successfully',
      data: updatedProvider 
    })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteProvider = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await Provider.exists({_id: id})
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

    const deleteProvider = await Provider.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the Provider has been deleted successfully',
      data: deleteProvider })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getProvider = async(request, response) => {
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
    
    const provider = await Provider.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(provider){
      response.status(200).json({code: 200,
        msg: 'success',
        data: provider})
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

const getAllProvider = async(request, response) => {
  try{
    const { name, address, email, pageReq } = request.body

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(name)
      filter['name'] = { $regex : new RegExp(name, 'i') }

    if(address)
      filter['dni'] = { $regex : new RegExp(address, 'i') }

    if(email)
      filter['email'] = { $regex : new RegExp(email, 'i') }
    
    if(page === 0){
      const provider = await Provider.find(filter)

      const data = {
        provider: provider, 
        totalPages: 1
      }

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await Provider.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const provider = await Provider.find(filter).skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const data = {
      providers: provider, 
      totalPages: countPage
    }

    response.status(200).json({code: 200,
      msg: 'success',
      data: data })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
}

module.exports = { createProvider, updateProvider, deleteProvider, getProvider, getAllProvider }
