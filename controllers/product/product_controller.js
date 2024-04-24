const Product = require('../../models/product_model')
const ProductFamily = require('../../models/product_family_model')
const Provider = require('../../models/provider_model')
const ObjectId = require('mongodb').ObjectId

const createProduct = async(request, response) => {
  try {
    const { name, pricePvpProd, pricePvpMan, provider, productFamily, photo, description } = request.body
    let errors = []
    if(!provider){
      errors.push({code: 400, 
        msg: 'invalid dealership',
        detail: 'dealership is required'
      })
    }
    else if(provider && !ObjectId.isValid(provider)) {
      return response.status(400).json({errors: [{code: 400,
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

    if(!productFamily)
      errors.push({code: 400, 
        msg: 'invalid productFamily',
        detail: 'productFamily is required'
      })
    else if(productFamily && !ObjectId.isValid(productFamily)) {
      return response.status(400).json({errors: [{code: 400,
        msg: 'invalid productFamily',
        detail: 'productFamily should be an objectId'}]})
    }
    else if(productFamily){
      const productFamilyExist = await ProductFamily.findById(productFamily)
      if(!productFamilyExist)
        errors.push({code: 400, 
          msg: 'invalid productFamily',
          detail: `${productFamily} not found`
        })
    }

    if (typeof(pricePvpProd) !== 'number') {
      errors.push({code: 400, 
        msg: 'invalid pricePvpProd',
        detail: 'The pricePvpProd field must be a positive number'
      })
    }

    if (pricePvpMan && typeof(pricePvpMan) !== 'number') {
      errors.push({code: 400, 
        msg: 'invalid pricePvpMan',
        detail: 'The pricePvpMan field must be a positive number'
      })
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const priceMan = (pricePvpMan !== undefined && pricePvpMan !== null) ? pricePvpMan : 0
    const price = pricePvpProd + priceMan
  
    const newProduct = new Product({
      name, 
      price, 
      pricePvpProd,
      pricePvpMan: pricePvpMan || null,
      provider, 
      productFamily, 
      photo,
      description
    })

    await newProduct.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 201,
      msg: 'the Product has been created successfully',
      data: newProduct
    })
  }
  catch(error) {
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateProduct = async(request, response) => {
  try{
    const {id} = request.params
    const { name, pricePvpProd, pricePvpMan, provider, productFamily, description, photo } = request.body

    let errors = []

    if(id && ObjectId.isValid(id)){
      const existId = await Product.findById(id)
        .catch(error => {return response.status(400).json({
          errors: [{code: 500, 
            msg: 'error id',
            detail: error.message
          }]
        })} )  

      if(!existId)
        return response.status(400).json({errors: [{code: 400, 
          msg: 'invalid id',
          detail: 'id not found'
        }]})
    }
    else{
      return response.status(400).json({ errors: [{code: 400, 
        msg: 'invalid id',
        detail: 'id not found'
      }]})   
    }

    if(productFamily && !ObjectId.isValid(productFamily)) {
      return response.status(400).json({ errors: [{code: 400,
        msg: 'invalid productFamily',
        detail: 'productFamily should be an objectId'}]})
    }
    else if(productFamily){
      const productFamilyExist = await ProductFamily.findById(productFamily)
      if(!productFamilyExist)
        errors.push({code: 400, 
          msg: 'invalid productFamily',
          detail: `${productFamily} not found`
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

    if (name && name.length < 1) {
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'The name is required'
      })
    }

    if (pricePvpProd && typeof(pricePvpProd) !== 'number') {
      errors.push({code: 400, 
        msg: 'invalid pricePvpProd',
        detail: 'The pricePvpProd is required'
      })
    }

    if (pricePvpMan && typeof(pricePvpMan) !== 'number') {
      errors.push({code: 400, 
        msg: 'invalid pricePvpMan',
        detail: 'The pricePvpMan is required'
      })
    }

    const updatedFields = {}

    const actualProduct = await Product.findById(id)

    if (pricePvpMan !== undefined && pricePvpMan !== null && pricePvpProd !== undefined && pricePvpProd !== null) {
      const priceMan = (pricePvpMan !== undefined && pricePvpMan !== null) ? pricePvpMan : 0
      const price = pricePvpProd + priceMan
      updatedFields['price'] = price
    } else if (pricePvpMan && !pricePvpProd) {
      const priceMan = (pricePvpMan !== undefined && pricePvpMan !== null) ? pricePvpMan : 0
      const price = actualProduct.pricePvpProd + priceMan
      updatedFields['price'] = price
    } else if (!pricePvpMan && pricePvpProd) {
      const priceMan = (actualProduct.pricePvpMan !== undefined && actualProduct.pricePvpMan !== null) ? actualProduct.pricePvpMan : 0
      const price = pricePvpProd + priceMan
      updatedFields['price'] = price
    }

    if(name)
      updatedFields['name'] = name
    if(pricePvpProd)
      updatedFields['pricePvpProd'] = pricePvpProd
    if(pricePvpMan !== undefined && pricePvpMan !== null)
      updatedFields['pricePvpMan'] = pricePvpMan
    if(provider)
      updatedFields['provider'] = provider
    if(provider)
      updatedFields['provider'] = provider
    if(productFamily)
      updatedFields['productFamily'] = productFamily
    if(description)
      updatedFields['description'] = description
    updatedFields['photo'] = photo
    updatedFields['updatedAt'] = Date.now()

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({
      code: 200,
      msg: 'the Product has been updated successfully',
      data: updatedProduct 
    })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteProduct = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await Product.exists({_id: id})
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

    const deleteProduct = await Product.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the Product has been deleted successfully',
      data: deleteProduct })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getProduct = async(request, response) => {
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
    
    const product = await Product.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(product){
      response.status(200).json({code: 200,
        msg: 'success',
        data: product})
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

const getAllProducts = async(request, response) => {
  try{
    const { productFamily, provider, name, pageReq } = request.body

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(productFamily)
      filter['productFamily'] = productFamily

    if(provider)
      filter['provider'] = provider

    if(name)
      filter['name'] = { $regex : new RegExp(name, 'i') }

    if(page === 0){
      const product = await Product.find(filter).populate({
        path: 'productFamily provider',
        select: '_id name'
      }).catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

      const productData = product.map((product) => {
        return {...product._doc, family: product.productFamily?.name, providerName: product.provider?.name }
      })

      const data = {
        product: productData,
        totalPages: 1
      }

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await Product.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const product = await Product.find(filter).populate({
      path: 'productFamily',
      select: '_id name'
    }).skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const productData = product.map((product) => {
      return {...product._doc, family: product.productFamily.name, providerName: product.provider.name }
    })

    const data = {
      products: productData, 
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

module.exports = { createProduct, updateProduct, deleteProduct, getProduct, getAllProducts }
