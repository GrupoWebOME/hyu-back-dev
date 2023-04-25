const Area = require('../../models/area_model')
const Criterion = require('../../models/criterion_model')
const Standard = require('../../models/standard_model')
const Block = require('../../models/block_model')
const Category = require('../../models/category_model')
const ObjectId = require('mongodb').ObjectId

const createStandard = async(request, response) => {
  try{
    const {description, comment, isCore, isException, number, isAgency, area} = request.body
    let standard_abbreviation = null
    let errors = []
    if(!area){
      errors.push({code: 400, 
        msg: 'invalid area',
        detail: 'area is required'
      })  
    }    
    else if(area){
      if(!ObjectId.isValid(area)){
        errors.push({code: 400, 
          msg: 'invalid area',
          detail: 'format should be a ObjectId'
        })  
      }
      else{                
        const existArea = await Area.findOne({_id: area})
        if(!existArea){
          errors.push({code: 400, 
            msg: 'invalid area',
            detail: 'area not found'
          })  
        }
                
        else if(number && existArea.area_abbreviation){
          standard_abbreviation = `${existArea.area_abbreviation}.${number}`
        }        
      }
    }
    if(!description || description.length < 1){
      errors.push({code: 400, 
        msg: 'invalid description',
        detail: 'description is required'
      })
    }
    else if(description){
      const existDescription = await Standard.exists({description: { $regex : new RegExp(description, 'i') }})
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      if(existDescription)
        errors.push({code: 400, 
          msg: 'invalid description',
          detail: `${description} is already in use`
        })
    }
    if(!number || typeof number !== 'number')
      errors.push({code: 400, 
        msg: 'invalid number',
        detail: 'number should be a number type, and number is required'
      })
    if((isAgency!== null && isAgency !== undefined) && typeof isAgency !== 'boolean')
      errors.push({code: 400, 
        msg: 'invalid isAgency',
        detail: 'isAgency should be a boolean type'
      })   
    if((isCore!== null && isCore !== undefined) && typeof isCore !== 'boolean')
      errors.push({code: 400, 
        msg: 'invalid isCore',
        detail: 'isCore should be a boolean type'
      }) 
    if((isException!== null && isException !== undefined) && typeof isException !== 'boolean')
      errors.push({code: 400, 
        msg: 'invalid isException',
        detail: 'isException should be a boolean type'
      })   
    if(comment && comment.length < 1)
      errors.push({code: 400, 
        msg: 'invalid comment',
        detail: 'comment should be a string type'
      })   
    if(errors.length > 0)
      return response.status(400).json({errors: errors})
    const areaById = await Area.findById(area)
    const newStandard = new Standard({
      number: number,
      description: description,
      isException: (isException && isException === true)? true : false,
      isAgency: (!isAgency || isAgency === false)? false : true,
      isCore: (!isCore && isCore === true)? true : false,
      area: area,
      block: areaById.block,
      category: areaById.category,
      standard_abbreviation: standard_abbreviation,
      comment: comment? comment : null
    })
    await newStandard.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    await Area.findByIdAndUpdate(area, {$push: { standards: newStandard._id }})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 201,
      msg: 'the standard has been created successfully',
      data: newStandard })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateStandard = async(request, response) => {
  try{
    const {id} = request.params
    const {description, comment, isCore, isException, number} = request.body
    let standard_abbreviation = null
    let errors = []
    if(id && ObjectId.isValid(id)){
      const existId = await Standard.findOne({_id: id})
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
      else if(existId?.standard_abbreviation){
        const index = existId.standard_abbreviation.lastIndexOf('.')
        standard_abbreviation = `${existId.standard_abbreviation.substring(0, index+1)}${number}`
      }
    }
    else{
      return response.status(400).json({code: 400, 
        msg: 'invalid id',
        detail: 'id not found'
      })   
    }
    if(number && typeof number !== 'number')
      errors.push({code: 400, 
        msg: 'invalid number',
        detail: 'number should be a number type, and number is required'
      })
    if(description){
      if(description.length < 1){
        errors.push({code: 400, 
          msg: 'invalid description',
          detail: 'description is required'
        })     
      }
      else{
        const existDescription = await Standard.findOne({description: { $regex : new RegExp(description, 'i') }})
          .catch(error => {        
            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
          })
        if(existDescription && existDescription._id.toString() !== id)
          errors.push({code: 400, 
            msg: 'invalid description',
            detail: `${description} is already in use`
          })
      }
    }
    if((isException !== undefined && isException !== null) && (isException !== true && isException !== false))
      errors.push({code: 400, 
        msg: 'invalid isException',
        detail: 'isException should be a boolean type'
      })
    if((isCore !== undefined && isCore !== null) && (isCore !== true && isCore !== false))
      errors.push({code: 400, 
        msg: 'invalid isCore',
        detail: 'isCore should be a boolean type'
      })
    if(comment && comment.length < 1)
      errors.push({code: 400, 
        msg: 'invalid comment',
        detail: 'comment should be a boolean type'
      })
    if(errors.length > 0)
      return response.status(400).json({errors: errors})
    const updatedFields = {}
    if(number){
      updatedFields['number'] = number
      updatedFields['standard_abbreviation'] = standard_abbreviation
    }
    if(description)
      updatedFields['description'] = description
    if(isException!==null && isException !==undefined && (isException === true || isException === false))
      updatedFields['isException'] = isException
    if(isCore!==null && isCore !==undefined && (isCore === true || isCore === false))
      updatedFields['isCore'] = isCore
    if(comment)
      updatedFields['comment'] = comment
    updatedFields['updatedAt'] = Date.now()
    const updatedStandard = await Standard.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 200,
      msg: 'the Standard has been updated successfully',
      data: updatedStandard })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteStandard = async(request, response) => {
  try{
    const {id} = request.params
    if(id && ObjectId.isValid(id)){
      const existId = await Standard.exists({_id: id})
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
    const deletedStandard = await Standard.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    await Criterion.deleteMany({standard: id})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    const areaById = await Area.findByIdAndUpdate(deletedStandard.area, {$pull: { standards: id }, $inc: {value: -deletedStandard.value}})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    const blockById = await Block.findByIdAndUpdate(areaById.block, {$inc: {value: -deletedStandard.value}})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    await Category.findByIdAndUpdate(blockById.category, {$inc: {value: -deletedStandard.value}})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 201,
      msg: 'the criterion has been deleted successfully',
      data: deletedStandard })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getAllStandard= async(request, response) => {
  try{
    const {description, isCore, isException, value, isAgency, area, pageReq} = request.body
    const page = !pageReq ? 0 : pageReq
    let skip = (page - 1) * 10
    const filter = {}
    if(area && !ObjectId.isValid(area)){
      return response.status(400).json({code: 400, 
        msg: 'invalid area',
        detail: 'format should be a ObjectId'
      })  
    }
    if(description)
      filter['description'] = { $regex : new RegExp(description, 'i') }
    if(value)
      filter['value'] = value
    if(isException !== undefined && isException !== null && (isException===true||isException===false))
      filter['isException'] = isException
    if(isAgency !== undefined && isAgency !== null && (isAgency===true||isAgency===false))
      filter['isAgency'] = isAgency
    if(area)
      filter['area'] = area
    if(isCore !== undefined && isCore !== null && (isCore===true||isCore===false))
      filter['isCore'] = isCore
    if(page === 0){
      const standards = await Standard.find(filter).populate({path: 'block category area criterions'})
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      const data = {standards: standards, 
        totalPages: 1}
      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
    let countDocs = await Standard.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)
    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, 
        msg: 'invalid page', 
        detail: `totalPages: ${countPage}`})
    const standards = await Standard.find(filter).skip(skip).limit(10).populate({path: 'block category area criterions'})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    const data = {standards: standards, 
      totalPages: countPage}
    response.status(200).json({code: 200,
      msg: 'success',
      data: data })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
}

const getStandard = async(request, response) => {
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
    const standard = await Standard.findById(id).populate({path: 'block category area criterions'})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    if(standard){
      response.status(200).json({code: 200,
        msg: 'success',
        data: standard})
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

module.exports = {createStandard, updateStandard, deleteStandard, getAllStandard, getStandard}
