const Order = require('../../models/order_model')
const Dealership = require('../../models/dealership_model')
const Installation = require('../../models/installation_schema')
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')

function isValidMaterial(product) {
  if (!('family' in product) || !('name' in product) || !('product' in product) || !('count' in product) || !('price' in product) || !('pricePvpProd' in product)) {
    return false
  }

  if (typeof product.product !== 'string') {
    return false
  }

  if (typeof product.name !== 'string') {
    return false
  }

  if (typeof product.family !== 'string') {
    return false
  }

  if (!Number.isInteger(product.count) || product.count < 0) {
    return false
  }

  if (typeof product.price !== 'number' || isNaN(product.price)) {
    return false
  }

  if (typeof product.pricePvpProd !== 'number' || isNaN(product.pricePvpProd)) {
    return false
  }

  if (product.pricePvpMan !== null && product.pricePvpMan !== undefined && typeof product.pricePvpMan !== 'number' || isNaN(product.pricePvpMan)) {
    return false
  }

  return true
}

const createOrder = async(request, response) => {
  try {
    const { dealership, installation, products, observations, orderNote } = request.body
    let errors = []

    if(!dealership){
      errors.push({code: 400, 
        msg: 'invalid dealership',
        detail: 'dealership is required'
      })
    } else if(dealership && !ObjectId.isValid(dealership)) {
      return response.status(400).json({code: 400,
        msg: 'invalid dealership',
        detail: 'dealership should be an objectId'})
    } else if(dealership){
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
      })} else if(installation && !ObjectId.isValid(installation)) {
      return response.status(400).json({code: 400,
        msg: 'invalid installation',
        detail: 'installation should be an objectId'})
    } else if(installation){
      const installationExist = await Installation.findById(installation)
      if(!installationExist)
        errors.push({code: 400, 
          msg: 'invalid installation',
          detail: `${installation} not found`
        })
    }

    if (!products || !Array.isArray(products)) {
      errors.push({code: 400, 
        msg: 'invalid products',
        detail: 'The products must be an array type'
      })
    } else {
      for (const product of products) {
        if (!isValidMaterial(product)) {
          errors.push({code: 400, 
            msg: 'invalid product',
            detail: `${product} is not in valid format`
          })
        }
      }
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const newOrder = new Order({
      dealership, 
      installation, 
      products, 
      observations, 
      orderNote, 
      state: 'Abierto'
    })

    newOrder.number = `HMES-${newOrder?._id?.toString().toUpperCase()}`

    await newOrder.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 201,
      msg: 'the Order has been created successfully',
      data: newOrder
    })
  }
  catch(error) {
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateOrder = async(request, response) => {
  try{
    const {id} = request.params
    const { dealership, installation, products, observations, orderNote, state } = request.body

    let errors = []

    if(id && ObjectId.isValid(id)){
      const existId = await Order.findById(id)
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

    if(dealership && !ObjectId.isValid(dealership)) {
      return response.status(400).json({code: 400,
        msg: 'invalid dealership',
        detail: 'dealership should be an objectId'})
    }
    else if(dealership){
      const dealershipExist = await Dealership.findById(dealership)
      if(!dealershipExist)
        errors.push({code: 400, 
          msg: 'invalid dealership',
          detail: `${dealership} not found`
        })
    }

    if(installation && !ObjectId.isValid(installation)) {
      return response.status(400).json({code: 400,
        msg: 'invalid installation',
        detail: 'installation should be an objectId'})
    }
    else if(installation){
      const installationExist = await Installation.findById(installation)
      if(!installationExist)
        errors.push({code: 400, 
          msg: 'invalid installation',
          detail: `${installation} not found`
        })
    }

    if (state && state !== 'Solicitado' && state !== 'Cancelado' && state !== 'Entregado') {
      errors.push({code: 400, 
        msg: 'invalid state',
        detail: 'The state must be Solicitado, Entregado or Cancelado'
      })
    }

    const updatedFields = {}

    if(dealership)
      updatedFields['dealership'] = dealership
    if(installation)
      updatedFields['installation'] = installation
    if(observations)
      updatedFields['observations'] = observations
    if(products)
      updatedFields['products'] = products
    if(orderNote)
      updatedFields['orderNote'] = orderNote
    if(state)
      updatedFields['state'] = state
    updatedFields['updatedAt'] = Date.now()

    const updatedOrder = await Order.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 200,
      msg: 'the Order has been updated successfully',
      data: updatedOrder 
    })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteOrder = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await Order.exists({_id: id})
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

    const deleteOrder = await Order.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the Order has been deleted successfully',
      data: deleteOrder })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getOrder = async(request, response) => {
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
    
    const order = await Order.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(order){
      response.status(200).json({code: 200,
        msg: 'success',
        data: order})
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

const getAllOrders = async(request, response) => {
  try{
    const { dealership, installation, state, pageReq } = request.body
    const authHeader = request.headers['authorization']

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(dealership)
      filter['dealership'] = dealership

    if(installation)
      filter['installation'] = installation

    if(state)
      filter['state'] = state

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
      const order = await Order.find(filter).populate({
        path: 'dealership installation',
        select: '_id name'
      })
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })

      const orderData = order.map((order) => {
        return {...order._doc, dealershipName: order.dealership.name, installationName: order.installation.name }
      })

      const data = {
        order: orderData, 
        totalPages: 1
      }

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await Order.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const order = await Order.find(filter).populate({
      path: 'dealership installation',
      select: '_id name'
    }).skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const orderData = order.map((order) => {
      return {...order._doc, dealershipName: order.dealership.name, installationName: order.installation.name }
    })

    const data = {
      orders: orderData, 
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

module.exports = { createOrder, updateOrder, deleteOrder, getOrder, getAllOrders }
