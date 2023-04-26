const Area = require('../../models/area_model')
const Block = require('../../models/block_model')
const Criterion = require('../../models/criterion_model')
const Standard = require('../../models/standard_model')
const Category = require('../../models/category_model')
const ObjectId = require('mongodb').ObjectId

const createArea = async(request, response) => {
  try{
    const {name, description, isException, number, isAgency, block} = request.body
    let area_abbreviation = null
    let errors = []
    if(!number || typeof number !== 'number')
      errors.push({code: 400, 
        msg: 'invalid number',
        detail: 'number should be a number type, and number is required'
      })
    if(!block)
      errors.push({code: 400, 
        msg: 'invalid block',
        detail: 'block is required'
      })      
    if(block){
      if(!ObjectId.isValid(block)){
        errors.push({code: 400, 
          msg: 'invalid block',
          detail: 'format should be a ObjectId'
        })  
      }
      else{                
        const existBlock = await Block.findOne({_id: block})
        if(!existBlock)
          errors.push({code: 400, 
            msg: 'invalid block',
            detail: 'block not found'
          })
        else if(number && existBlock.category_abbreviation){
          area_abbreviation = `${existBlock.category_abbreviation}.${number}`
        }        
      }
    }
    if(!name || name.length < 1)
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'name is required'
      })
    else if(name){
      const existName = await Area.exists({name: { $regex : new RegExp(name, 'i') }})
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      if(existName)
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: `${name} is already in use`
        })
    }
    if(!description || description.length < 1)
      errors.push({code: 400, 
        msg: 'invalid description',
        detail: 'description is required'
      })
    if(isAgency !== null && isAgency !== undefined && typeof isAgency !== 'boolean')
      errors.push({code: 400, 
        msg: 'invalid isAgency',
        detail: 'isAgency should be a boolean type'
      })    
    if(isException !== null && isException !== undefined && typeof isException !== 'boolean')
      errors.push({code: 400, 
        msg: 'invalid isException',
        detail: 'isException should be a boolean type'
      })   
    if(errors.length > 0)
      return response.status(400).json({errors: errors})
    const blockById = await Block.findById(block)
    const newArea = new Area({
      name: name,
      number: number,
      block: block,
      category: blockById.category,
      description: description,
      isException: (isException && isException === true)? true : false,
      area_abbreviation: area_abbreviation,
      isAgency: (!isAgency || isAgency === false)? false : true
    })
    await newArea.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    await Block.findByIdAndUpdate(block, {$push: { areas: newArea._id }})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 201,
      msg: 'the area has been created successfully',
      data: newArea })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateArea = async(request, response) => {
  try{
    const {id} = request.params
    const {name, description, isException, number} = request.body
    let area_abbreviation = null
    let errors = []
    if(id && ObjectId.isValid(id)){
      const existId = await Area.findOne({_id: id})
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error id',
          detail: error.message
        })} )  
      if(!existId){
        return response.status(400).json({code: 400, 
          msg: 'invalid id',
          detail: 'id not found'
        })
      }
      else if(existId.area_abbreviation){
        const index = existId.area_abbreviation.lastIndexOf('.')
        area_abbreviation = `${existId.area_abbreviation.substring(0, index+1)}${number}`
      }
    }
    else{
      return response.status(400).json({code: 400, 
        msg: 'invalid id',
        detail: 'id not found'
      })   
    }
    if(name){
      if(name.length < 1){
        errors.push({code: 400, 
          msg: 'invalid name',
          detail: 'name is required'
        })
      }
      else{
        const existName = await Area.findOne({name: { $regex : new RegExp(name, 'i') }})
          .catch(error => {        
            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
          })
        if(existName && existName._id.toString() !== id)
          errors.push({code: 400, 
            msg: 'invalid name',
            detail: `${name} is already in use`
          })
      }
    }
    if(number && typeof number !== 'number')
      errors.push({code: 400, 
        msg: 'invalid number',
        detail: 'number should be a number type, and number is required'
      })
    if(description && description.length < 1)
      errors.push({code: 400, 
        msg: 'invalid description',
        detail: 'description should be a string type, and description is required'
      })
    if((isException !== undefined && isException !== null) && (isException !== true && isException !== false))
      errors.push({code: 400, 
        msg: 'invalid isException',
        detail: 'isException should be a boolean type'
      })
    if(errors.length > 0)
      return response.status(400).json({errors: errors})
    const updatedFields = {}
    if(name)
      updatedFields['name'] = name
    if(number){
      updatedFields['number'] = number
      updatedFields['area_abbreviation'] = area_abbreviation
    }
    if(description)
      updatedFields['description'] = description
    if(isException!==null && isException !==undefined && (isException === true || isException === false))
      updatedFields['isException'] = isException
    updatedFields['updatedAt'] = Date.now()
    const updatedArea = await Area.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 200,
      msg: 'the Area has been updated successfully',
      data: updatedArea })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteArea = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await Area.exists({_id: id})
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

    const deletedArea = await Area.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    await Standard.deleteMany({area: id})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    await Criterion.deleteMany({area: id})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const blockById = await Block.findByIdAndUpdate(deletedArea.block, {$pull: { areas: id }, $inc: {value: -deletedArea.value}})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
                        
    await Category.findByIdAndUpdate(blockById.category, {$inc: {value: -deletedArea.value}})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({code: 201,
      msg: 'the area has been deleted successfully',
      data: deletedArea })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getAllArea= async(request, response) => {
  try{
    const { name, isException, value, isAgency, block, pageReq} = request.body

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(block && !ObjectId.isValid(block)){
      return response.status(400).json({code: 400, 
        msg: 'invalid block',
        detail: 'format should be a ObjectId'
      })  
    }

    if(name)
      filter['name'] = { $regex : new RegExp(name, 'i') } 

    if(value)
      filter['value'] = value

    if(isException !== undefined && isException !== null && (isException === true || isException === false))
      filter['isException'] = isException

    if(isAgency !== undefined && isAgency !== null && (isAgency === true || isAgency === false))
      filter['isAgency'] = isAgency

    if(block)
      filter['block'] = block

    if(page === 0){
      const areas = await Area.find(filter).populate({path: 'block category standards'})
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      const data = {areas: areas, 
        totalPages: 1}

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await Area.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, 
        msg: 'invalid page', 
        detail: `totalPages: ${countPage}`})

    const areas = await Area.find(filter).skip(skip).limit(10).populate({path: 'block category standards'})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const data = {areas: areas, 
      totalPages: countPage}

    response.status(200).json({code: 200,
      msg: 'success',
      data: data })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
}

const getArea = async(request, response) => {
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
    
    const area = await Area.findById(id).populate({path: 'block category standards'})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(area){
      response.status(200).json({code: 200,
        msg: 'success',
        data: area})
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

module.exports = {createArea, updateArea, deleteArea, getAllArea, getArea}
