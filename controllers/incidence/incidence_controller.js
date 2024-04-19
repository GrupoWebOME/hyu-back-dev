const Provider = require('../../models/provider_model')
const Dealership = require('../../models/dealership_model')
const Installation = require('../../models/installation_schema')
const Incidence = require('../../models/incidence_model')
const IncidenceType = require('../../models/incidence_type_model')
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')

function nextCode(actualCode) {
  const actual = parseInt(actualCode.substring(6))
  const nextNumber = actual + 1
  const formatedNumber = String(nextNumber).padStart(6, '0')
  const newCode = 'INCID-' + formatedNumber
  return newCode
}

const createIncidence = async(request, response) => {
  try {
    const { name, description, dealership, installation, photo, incidenceType } = request.body
    let errors = []

    if(!dealership){
      errors.push({code: 400, 
        msg: 'invalid dealership',
        detail: 'dealership is required'
      })
    }
    else if(dealership && !ObjectId.isValid(dealership)) {
      return response.status(400).json({ errors: [{code: 400,
        msg: 'invalid dealership',
        detail: 'dealership should be an objectId'}]})
    }
    else if(dealership){
      const dealershipExist = await Dealership.findById(dealership)
      if(!dealershipExist)
        errors.push({code: 400, 
          msg: 'invalid dealership',
          detail: `${dealership} not found`
        })
    }

    if(!installation){
      errors.push({code: 400, 
        msg: 'invalid installation',
        detail: 'installation is required'
      })
    }
    else if(installation && !ObjectId.isValid(installation)) {
      return response.status(400).json({ errors: [{code: 400,
        msg: 'invalid installation',
        detail: 'installation should be an objectId'}]})
    }
    else if(installation){
      const installationExist = await Installation.findById(installation)
      if(!installationExist)
        errors.push({code: 400, 
          msg: 'invalid installation',
          detail: `${installation} not found`
        })
    }

    if (!photo || photo.length === 0) {
      errors.push({code: 400, 
        msg: 'invalid photo',
        detail: 'photo incidence is required'
      })
    }

    if(!incidenceType){
      errors.push({code: 400, 
        msg: 'invalid incidenceType',
        detail: 'incidenceType is required'
      })
    }
    else if(incidenceType && !ObjectId.isValid(incidenceType)) {
      return response.status(400).json({ errors: [{code: 400,
        msg: 'invalid incidenceType',
        detail: 'incidenceType should be an objectId'}]})
    }
    else if(incidenceType){
      const incidenceTypeExist = await IncidenceType.findById(incidenceType)
      if(!incidenceTypeExist)
        errors.push({code: 400, 
          msg: 'invalid incidenceType',
          detail: `${incidenceType} not found`
        })
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const lastCreatedOrder = await Incidence.findOne().sort({ createdAt: -1 })
    const number = lastCreatedOrder?.number? nextCode(lastCreatedOrder?.number) : 'INCID-000001'

    const newIncidence = new Incidence({
      name, 
      photo, 
      description, 
      dealership,
      installation,
      status: 'Abierta',
      incidenceType,
      number
    })

    await newIncidence.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 201,
      msg: 'the Incidence has been created successfully',
      data: newIncidence
    })
  }
  catch(error) {
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateIncidence = async(request, response) => {
  try{
    const {id} = request.params
    const { name, provider, description, photo, installation, dealership, status, incidenceType } = request.body

    let errors = []

    if(id && ObjectId.isValid(id)){
      const existId = await Incidence.findById(id)
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
        msg: 'invalid dealership',
        detail: 'dealership should be an objectId'}]})
    }
    else if(provider){
      const providerExist = await Provider.findById(provider)
      if(!providerExist)
        errors.push({code: 400, 
          msg: 'invalid provider',
          detail: `${provider} not found`
        })
    }

    if(dealership && !ObjectId.isValid(dealership)) {
      return response.status(400).json({ errors: [{code: 400,
        msg: 'invalid dealership',
        detail: 'dealership should be an objectId'}]})
    }
    else if(dealership){
      const dealershipExist = await Dealership.findById(dealership)
      if(!dealershipExist)
        errors.push({code: 400, 
          msg: 'invalid dealership',
          detail: `${dealership} not found`
        })
    }

    if(incidenceType && !ObjectId.isValid(incidenceType)) {
      return response.status(400).json({ errors: [{code: 400,
        msg: 'invalid incidenceType',
        detail: 'incidenceType should be an objectId'}]})
    }
    else if(incidenceType){
      const incidenceTypeExist = await IncidenceType.findById(incidenceType)
      if(!incidenceTypeExist)
        errors.push({code: 400, 
          msg: 'invalid incidenceType',
          detail: `${incidenceType} not found`
        })
    }

    if (name && name.length < 1) {
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'The name is required'
      })
    }

    if (photo && photo.length === 0) {
      errors.push({code: 400, 
        msg: 'invalid photo',
        detail: 'photo incidence is required'
      })
    }

    if (status && !['Abierta', 'Cerrada', 'Cancelada', 'En trámite'].includes(status)) {
      errors.push({code: 400, 
        msg: 'invalid status',
        detail: 'The status field must be "Abierta, "Cerrada", "Cancelada", "En trámite'
      })
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const updatedFields = {}

    if(name)
      updatedFields['name'] = name
    if(photo)
      updatedFields['photo'] = photo
    if(description)
      updatedFields['description'] = description
    if(installation)
      updatedFields['installation'] = installation
    if(dealership)
      updatedFields['dealership'] = dealership
    if(incidenceType)
      updatedFields['incidenceType'] = incidenceType
    if(status)
      updatedFields['status'] = status
    updatedFields['updatedAt'] = Date.now()

    const updatedIncidence = await Incidence.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 200,
      msg: 'the Incidence has been updated successfully',
      data: updatedIncidence 
    })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteIncidence = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await Incidence.exists({_id: id})
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

    const deleteIncidence = await Incidence.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the Incidence has been deleted successfully',
      data: deleteIncidence })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getIncidence = async(request, response) => {
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
    
    const incidence = await Incidence.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(incidence){
      response.status(200).json({code: 200,
        msg: 'success',
        data: incidence})
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

const getAllIncidences = async(request, response) => {
  try{
    const { dealership, installation, name, type, pageReq } = request.body
    const authHeader = request.headers['authorization']

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(dealership)
      filter['dealership'] = dealership

    if(installation)
      filter['installation'] = installation

    if(name)
      filter['name'] = { $regex : new RegExp(name, 'i') }

    if(type)
      filter['type'] = { $regex : new RegExp(type, 'i') }

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

      if(decodedToken?.admin?.dealership) {
        filter['dealership'] = decodedToken?.admin?.dealership
      }
    }

    if(page === 0){
      const incidence = await Incidence.find(filter).populate({
        path: 'dealership installation incidenceType',
        select: '_id name'
      })
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      const incidenceData = incidence.map((incidence) => {
        const createdAt = new Date(incidence.createdAt)
        const currentDate = new Date()
        const differenceMs = currentDate - createdAt
        const differenceDays = differenceMs / (1000 * 60 * 60 * 24)
        console.log(incidence)
        return {
          ...incidence._doc, 
          dealershipName: incidence.dealership?.name, 
          installationName: incidence.installation?.name, 
          incidenceTypeName: incidence.incidenceType?.name,
          incidenceNumber: incidence.number,
          createdIncidenceDate: incidence.createdAt,
          backgroundColor: differenceDays > 30? 'red' : incidence.status === 'Abierta' ? 'green' : 'transparent'
        }
      })

      const data = {
        incidence: incidenceData, 
        totalPages: 1
      }

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await Incidence.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const incidence = await Incidence.find(filter).populate({
      path: 'dealership installation incidenceType',
      select: '_id name'
    }).skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const incidenceData = incidence.map((incidence) => {
      const createdAt = new Date(incidence.createdAt)
      const currentDate = new Date()
      const differenceMs = currentDate - createdAt
      const differenceDays = differenceMs / (1000 * 60 * 60 * 24)
      return {
        ...incidence._doc, 
        dealershipName: incidence.dealership?.name, 
        installationName: incidence.installation?.name, 
        incidenceTypeName: incidence.incidenceType?.name,
        incidenceNumber: incidence.number,
        createdIncidenceDate: incidence.createdAt,
        backgroundColor: differenceDays > 30? 'red' : incidence.status === 'Abierta' ? 'green' : 'transparent'
      }
    })

    const data = {
      incidence: incidenceData, 
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

module.exports = { createIncidence, updateIncidence, deleteIncidence, getIncidence, getAllIncidences }
