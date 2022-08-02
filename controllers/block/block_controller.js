const Block = require('../../models/block_model')
const Area = require('../../models/area_model')
const Standard = require('../../models/standard_model')
const Criterion = require('../../models/criterion_model')
const Category = require('../../models/category_model')
const ObjectId = require('mongodb').ObjectId

const createBlock = async(request, response) => {
    try{
        const {name, number, isAgency, category} = request.body
        let category_abbreviation = null
        let errors = []
        if(!number || typeof number !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid number',
                            detail: `number should be a number type, and number is required`
                        })
        if(isAgency && typeof isAgency !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isAgency',
                        detail: `isAgency should be a boolean type`
                        })  
        if(!category)
            errors.push({code: 400, 
                        msg: 'invalid category',
                        detail: `category is required`
                        })      
        if(category){
            if(!ObjectId.isValid(category)){
                errors.push({code: 400, 
                    msg: 'invalid block',
                    detail: `format should be a ObjectId`
                    })  
            }
            else{                
                const existCategory = await Category.findOne({_id: category})
                if(!existCategory)
                    errors.push({code: 400, 
                                msg: 'invalid category',
                                detail: `category not found`
                                })    
                else if(number){
                    category_abbreviation = `${existCategory.abbreviation}.${number}`
                }    
            }
        }
        if(!name || name.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name',
                            detail: `name is required`
                        })
        else if(name){
            const existName = await Block.exists({name: { $regex : new RegExp(name, "i") }})
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existName)
                errors.push({code: 400, 
                             msg: 'invalid name',
                             detail: `${name} is already in use`
                            })
        }        
        if(errors.length > 0)
            return response.status(400).json({errors: errors})
        const newBlock = new Block({
            name: name,
            number: number,
            category: category,
            category_abbreviation: category_abbreviation,
            isAgency: (!isAgency || isAgency === false)? false : true
        })
        await newBlock.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })
        await Category.findByIdAndUpdate(category, {$push: { blocks: newBlock._id }})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })
        response.status(201).json({code: 201,
                                    msg: 'the block has been created successfully',
                                    data: newBlock })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateBlock = async(request, response) => {
    try{
        const {id} = request.params
        const {name, number} = request.body
        let category_abbreviation = null
        let errors = []
        if(id && ObjectId.isValid(id)){
            const existId = await Block.findOne({_id: id})
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!existId)
                return response.status(400).json({code: 400, 
                                                  msg: 'invalid id',
                                                  detail: 'id not found'
                                                })
            else{
                const index = existId.category_abbreviation.lastIndexOf('.')
                category_abbreviation = `${existId.category_abbreviation.substring(0, index+1)}${number}`
            }
        }
        else{
            return response.status(400).json({code: 400, 
                                              msg: 'invalid id',
                                              detail: `id not found`
                                            })   
        }
        if(name){
            if(name.length < 1){
                errors.push({code: 400, 
                                msg: 'invalid name',
                                detail: `name is required`
                            })
            }
            else{
                const existName = await Block.findOne({name: { $regex : new RegExp(name, "i") }})
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
                            detail: `number should be a number type, and number is required`
                        })
        if(errors.length > 0)
            return response.status(400).json({errors: errors})
        const updatedFields = {}
        if(name)
            updatedFields['name'] = name
        if(number){
            updatedFields['number'] = number
            updatedFields['category_abbreviation'] = category_abbreviation
        }
        updatedFields['updatedAt'] = Date.now()
        const updatedBlock = await Block.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        response.status(201).json({code: 200,
                                    msg: 'the Block has been updated successfully',
                                    data: updatedBlock })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteBlock = async(request, response) => {
    try{
        const {id} = request.params
        if(id && ObjectId.isValid(id)){
            const existId = await Block.exists({_id: id})
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
                                              detail: `id not found`
                                            })   
        }
        const deletedBlock = await Block.findByIdAndDelete(id)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
        await Area.deleteMany({block: id})
                    .catch(error => {        
                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                    })
        await Standard.deleteMany({block: id})
                    .catch(error => {        
                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                    })
        await Criterion.deleteMany({block: id})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })
        await Category.findByIdAndUpdate(deletedBlock.category, {$pull: { blocks: id }, $inc: {value: -deletedBlock.value}})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })
        response.status(201).json({code: 201,
                                    msg: 'the block has been deleted successfully',
                                    data: deletedBlock })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllBlock= async(request, response) => {
    try{
        const {name, value, isAgency, pageReq} = request.body
        const page = !pageReq ? 0 : pageReq
        let skip = (page - 1) * 10
        const filter = {}
        if(name)
            filter['name'] = { $regex : new RegExp(name, "i") } 
        if(value)
            filter['value'] = value
        if(isAgency !== null && isAgency !== undefined && (isAgency === true || isAgency === false))
            filter['isAgency'] = isAgency
        if(page === 0){
            const blocks = await Block.find(filter).populate({path: 'areas category'})
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {blocks: blocks, 
                          totalPages: 1}
            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
        let countDocs = await Block.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)
        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400,
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})

        const blocks = await Block.find(filter).skip(skip).limit(10).populate({path: 'areas category'})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        const data = {blocks: blocks, 
                      totalPages: countPage}
        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getBlock = async(request, response) => {
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
        const block = await Block.findById(id).populate({path: 'areas category'})
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

module.exports = {createBlock, updateBlock, deleteBlock, getAllBlock, getBlock}
