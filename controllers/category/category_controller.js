const Category = require('../../models/category_model')
const Block = require('../../models/block_model')
const Area = require('../../models/area_model')
const Standard = require('../../models/standard_model')
const Criterion = require('../../models/criterion_model')
const ObjectId = require('mongodb').ObjectId

const createCategory = async(request, response) => {
    try{
        const {name, abbreviation, isAgency, categoryType} = request.body

        let errors = []

        if(!name || name.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name',
                            detail: `name is required`
                        })
        else if(name){
            const existName = await Category.exists({name: { $regex : new RegExp(name, "i") }, isAgency: (isAgency!==true && isAgency!==false)? false:isAgency })
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existName)
                errors.push({code: 400, 
                             msg: 'invalid name',
                             detail: `${name} is already in use`
                            })
        }

        if(categoryType){
            if(categoryType.length < 1 || (categoryType !== "VN" && categoryType !== "PV" && categoryType !== "HP" && categoryType !== "OTHER") ){
                errors.push({code: 400, 
                                msg: 'invalid categoryType',
                                detail: `categoryType is required and should be VN, PV, HP`
                            })
                }
        }

        if(!abbreviation || abbreviation.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid abbreviation',
                            detail: `abbreviation is required`
                        })
        else if(abbreviation){
            const existAbbreviation = await Category.exists({abbreviation: { $regex : new RegExp(abbreviation, "i") }, isAgency: (isAgency!==true && isAgency!==false)? false:isAgency})
                                                    .catch(error => {        
                                                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                    })
            if(existAbbreviation)
                errors.push({code: 400, 
                             msg: 'invalid abbreviation',
                             detail: `${abbreviation} is already in use`
                            })
        }

        if(isAgency!==null && isAgency!==undefined && typeof isAgency !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isAgency',
                        detail: `isAgency should be a boolean type`
                        })          

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const newCategory = new Category({
            name: name,
            abbreviation: abbreviation,
            isAgency: (!isAgency || isAgency === false)? false : true,
            categoryType: categoryType
        })

        await newCategory.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })

        response.status(201).json({code: 201,
                                    msg: 'the category has been created successfully',
                                    data: newCategory })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateCategory = async(request, response) => {
    try{
        const {id} = request.params
        const {name, abbreviation, categoryType} = request.body
        let existId = null
        let errors = []

        if(id && ObjectId.isValid(id)){
            existId = await Category.findById(id)
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
           
        if(name){
            if(name.length < 1){
            errors.push({code: 400, 
                            msg: 'invalid name',
                            detail: `name is required`
                        })
            }
            else{
                const existName = await Category.findOne({name: { $regex : new RegExp(name, "i") } , isAgency: existId.isAgency})
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

        if(abbreviation){
            if(abbreviation.length < 1){
            errors.push({code: 400, 
                            msg: 'invalid abbreviation',
                            detail: `abbreviation is required`
                        })
            }
            else{
                const existAbbreviation = await Category.findOne({abbreviation: { $regex : new RegExp(abbreviation, "i") }, isAgency: existId.isAgency})
                                                        .catch(error => {        
                                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                        })
                if(existAbbreviation && existAbbreviation._id.toString() !== id)
                    errors.push({code: 400, 
                                msg: 'invalid abbreviation',
                                detail: `${abbreviation} is already in use`
                                })
            }
        }

        if(categoryType){
            if(categoryType.length < 1 || (categoryType !== "VN" && categoryType !== "PV" && categoryType !== "HP" && categoryType !== "OTHER") ){
                errors.push({code: 400, 
                                msg: 'invalid categoryType',
                                detail: `categoryType is required and should be VN, PV, HP`
                            })
                }
        }

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}
        if(name)
            updatedFields['name'] = name
        if(abbreviation)
            updatedFields['abbreviation'] = abbreviation
        if(categoryType)
            updatedFields['categoryType'] = categoryType
        updatedFields['updatedAt'] = Date.now()

        const updatedCategory = await Category.findByIdAndUpdate(id, updatedFields, {new: true})
                                              .catch(error => {        
                                                  return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })

        response.status(201).json({code: 200,
                                    msg: 'the category has been updated successfully',
                                    data: updatedCategory })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteCategory = async(request, response) => {
    try{
        const {id} = request.params

        if(id && ObjectId.isValid(id)){
            const existId = await Category.exists({_id: id})
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

        const deletedCategory = await Category.findByIdAndDelete(id)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })

        await Block.deleteMany({category: id})
                    .catch(error => {        
                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                    })           

        await Area.deleteMany({category: id})
                    .catch(error => {        
                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                    })   

        await Standard.deleteMany({category: id})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })   
                        
        await Criterion.deleteMany({category: id})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })   
        
        response.status(201).json({code: 201,
                                   msg: 'the category has been deleted successfully',
                                   data: deletedCategory })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllCategories = async(request, response) => {
    try{
        const {name, abbreviation, value, installationType, isAgency, pageReq} = request.body

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        const filter = {}
            
        if(name)
            filter['name'] = { $regex : new RegExp(name, "i") } 

        if(abbreviation)
            filter['abbreviation'] = { $regex : new RegExp(abbreviation, "i") } 

        if(value)
            filter['value'] = value
        
        if(isAgency !== undefined && isAgency !== null && (isAgency === true || isAgency === false))
            filter['isAgency'] = isAgency
        
        if(installationType && Array.isArray(installationType)){
            const criterions = await Criterion.find({installationType: {$in: installationType}})
            let arrayBlocks = null
            if(criterions && criterions.length>0){
                arrayBlocks = criterions.map((element) => {
                    return element.block
                })
            }
            if(arrayBlocks){
                filter['blocks'] = {$in: arrayBlocks}
            }
        }

        if(page === 0){
            const categories = await Category.find(filter).populate({path: 'blocks',   populate: {
                path: 'areas',
                populate: {
                    path: 'standards',
                    populate: {
                        path: 'criterions',
                      }
                  }
              }})
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })

            if(filter.isAgency === false && filter.isAgency !== undefined){
                function categoryValue(category_name){
                    if(category_name === 'GENERAL'){
                        return 1
                    } else if(category_name === 'VENTA'){
                        return 2
                    } else if(category_name === 'HYUNDAI PROMISE'){
                        return 3
                    } else {
                        return 4
                    }
                }

                categories?.sort((a,b) => {
                    const a_value = categoryValue(a.name)
                    const b_value = categoryValue(b.name)
                    return a_value-b_value
                })   
            }

            const data = {categories: categories, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await Category.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if((countPage < page && page > 0)&& page !==1)
            return response.status(400).json({code: 400, 
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})

        const categories = await Category.find(filter).skip(skip).limit(10).populate({path: 'blocks',   populate: {
            path: 'areas',
            populate: {
                path: 'standards',
                populate: {
                    path: 'criterions',
                  }
              }
          }})
            .catch(error => {        
                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
            })

        if(filter.isAgency === false && filter.isAgency !== undefined){
            function categoryValue(category_name){
                if(category_name === 'GENERAL'){
                    return 1
                } else if(category_name === 'VENTA'){
                    return 2
                } else if(category_name === 'HYUNDAI PROMISE'){
                    return 3
                } else {
                    return 4
                }
            }

            categories?.sort((a,b) => {
                const a_value = categoryValue(a.name)
                const b_value = categoryValue(b.name)
                return a_value-b_value
            })   
        }

        const data = {categories: categories, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getCategory = async(request, response) => {
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

        const category = await Category.findById(id).populate({path: 'blocks',   populate: {
                path: 'areas',
                populate: {
                    path: 'standards',
                  }
              }})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        if(category){
            response.status(200).json({code: 200,
                                    msg: 'success',
                                    data: category})
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

module.exports = {createCategory, updateCategory, deleteCategory, getAllCategories, getCategory}
