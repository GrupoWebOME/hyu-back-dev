const ProductFamily = require('../../models/product_family_model')
const ObjectId = require('mongodb').ObjectId
const Product = require('../../models/product_model')

const createProductFamily = async(request, response) => {
  try {
    const { name } = request.body
    let errors = []

    if (!name) {
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'The name field ir required'
      })
    } else {
      const existName = await ProductFamily.findOne({ name, isDeleted: false })
      if (existName) {
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: 'The name already exists'
        })
      }
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const newProductFamily = new ProductFamily({
      name,
    })

    await newProductFamily.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 201,
      msg: 'the ProductFamily has been created successfully',
      data: newProductFamily
    })
  }
  catch(error) {
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateProductFamily = async(request, response) => {
  try{
    const {id} = request.params
    const { name } = request.body

    let errors = []

    if(id && ObjectId.isValid(id)){
      const existId = await ProductFamily.findById(id)
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

    if (name && name.length < 1) {
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'The name is required'
      })
    } else {
      const existName = await ProductFamily.findOne({ name, isDeleted: false })
      if (existName && (existName?._id?.toString() !== id?.toString())) {
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: 'The name already exists'
        })
      }
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const updatedFields = {}

    if(name)
      updatedFields['name'] = name
    updatedFields['updatedAt'] = Date.now()

    const updatedProductFamily = await ProductFamily.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 200,
      msg: 'the ProductFamily has been updated successfully',
      data: updatedProductFamily 
    })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteProductFamily = async(request, response) => {
  try{
    const {id} = request.params
    if(id && ObjectId.isValid(id)){
      const existId = await ProductFamily.exists({_id: id})
        .catch(error => {return response.status(400).json(
          {
            errors: [{
              code: 500, 
              msg: 'error id',
              detail: error.message
            }]
          }
        )} )  
      if(!existId)
        return response.status(400).json(
          {
            errors: [{
              code: 400, 
              msg: 'invalid id',
              detail: 'id not found'
            }]
          }
        )
    }
    else{
      return response.status(400).json({
        errors: [{
          code: 400, 
          msg: 'invalid id',
          detail: 'id not found'
        }]
      })   
    }

    const updatedFields = {}

    updatedFields['isDeleted'] = true
    updatedFields['updatedAt'] = Date.now()

    await ProductFamily.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    /*
        const deleteProductFamily = await ProductFamily.findByIdAndDelete(id)
          .catch(error => {        
            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
          })
    */

    const updatedProductFields = {}
    updatedProductFields['isDeleted'] = true
    updatedProductFields['updatedAt'] = Date.now()

    await Product.updateMany({productFamily: id}, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the ProductFamily has been deleted successfully',
      data: '' })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getProductFamily = async(request, response) => {
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
    
    const productFamily = await ProductFamily.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(productFamily){
      response.status(200).json({code: 200,
        msg: 'success',
        data: productFamily})
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

const getAllProductsFamilies = async(request, response) => {
  try{
    const { name, pageReq } = request.body

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {isDeleted: false}

    if(name)
      filter['name'] = { $regex : new RegExp(name, 'i') }

    if(page === 0){
      const productFamily = await ProductFamily.find(filter)
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })

      const data = {
        productFamily, 
        totalPages: 1
      }

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await ProductFamily.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const productFamily = await ProductFamily.find(filter).skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const data = {
      productFamily, 
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

module.exports = { createProductFamily, updateProductFamily, deleteProductFamily, getProductFamily, getAllProductsFamilies }
