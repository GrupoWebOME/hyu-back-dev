const Provider = require('../../models/provider_model')
const IncidenceType = require('../../models/incidence_type_model')
const ObjectId = require('mongodb').ObjectId

const createIncidenceType = async(request, response) => {
  try {
    const { name, description, provider } = request.body
    let errors = []

    if(!provider){
      errors.push({code: 400, 
        msg: 'invalid provider',
        detail: 'provider is required'
      })
    }
    else if(provider && !ObjectId.isValid(provider)) {
      return response.status(400).json({ errors: [{code: 400,
        msg: 'invalid provider',
        detail: 'provider should be an objectId'}]})
    }
    else if(provider){
      const providerExist = await Provider.findById(provider)
      if(!providerExist)
        errors.push({code: 400, 
          msg: 'invalid provider',
          detail: `${provider} not found`
        })
    }

    if (!name) {
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'The name field is required'
      })
    } else if(name){
      const nameExist = await IncidenceType.findOne({name})
      if(nameExist)
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: `${name} already exists`
        })
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const newIncidenceType = new IncidenceType({
      name, 
      provider, 
      description, 
    })

    await newIncidenceType.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 201,
      msg: 'the Incidence type has been created successfully',
      data: newIncidenceType
    })
  }
  catch(error) {
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateIncidenceType = async(request, response) => {
  try{
    const {id} = request.params
    const { name, description, provider } = request.body

    let errors = []

    if(id && ObjectId.isValid(id)){
      const existId = await IncidenceType.findById(id)
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

    if(provider && !ObjectId.isValid(provider)) {
      return response.status(400).json({ errors: [{code: 400,
        msg: 'invalid provider',
        detail: 'provider should be an objectId'}]})
    }
    else if(provider){
      const providerExist = await Provider.findById(provider)
      if(!providerExist)
        errors.push({code: 400, 
          msg: 'invalid provider',
          detail: `${provider} not found`
        })
    }

    const updatedFields = {}

    if(name)
      updatedFields['name'] = name
    if(description)
      updatedFields['description'] = description
    if(provider)
      updatedFields['provider'] = provider
    updatedFields['updatedAt'] = Date.now()

    const updatedIncidenceType = await IncidenceType.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 200,
      msg: 'the Incidence Type has been updated successfully',
      data: updatedIncidenceType
    })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteIncidenceType = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await IncidenceType.exists({_id: id})
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

    const deleteIncidenceType = await IncidenceType.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the Incidence has been deleted successfully',
      data: deleteIncidenceType })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getIncidenceType = async(request, response) => {
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
    
    const incidenceType = await IncidenceType.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(incidenceType){
      response.status(200).json({code: 200,
        msg: 'success',
        data: incidenceType})
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

const getAllIncidencesTypes = async(request, response) => {
  try{
    const { provider, name, pageReq } = request.body

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(provider)
      filter['provider'] = provider

    if(name)
      filter['name'] = { $regex : new RegExp(name, 'i') }

    if(page === 0){
      const incidenceType = await IncidenceType.find(filter).populate({
        path: 'provider',
        select: '_id name'
      })
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })

      const incidenceData = incidenceType.map((incidence) => {
        return {...incidence._doc, providerName: incidence.provider?.name }
      })

      const data = {
        incidenceType: incidenceData, 
        totalPages: 1
      }

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await IncidenceType.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const incidenceType = await IncidenceType.find(filter).populate({
      path: 'provider',
      select: '_id name'
    }).skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const incidenceData = incidenceType.map((incidence) => {
      return {...incidence._doc, providerName: incidence.provider.name }
    })

    const data = {
      incidenceType: incidenceData, 
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

module.exports = { createIncidenceType, updateIncidenceType, deleteIncidenceType, getIncidenceType, getAllIncidencesTypes }
