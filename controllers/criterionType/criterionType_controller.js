const CriterionType = require('../../models/criterionType_model')
const ObjectId = require('mongodb').ObjectId

const createCriterionType = async(request, response) => {
    try{
        const {idSecondary, name} = request.body
        let errors = []
        if(!idSecondary || idSecondary.length < 1)
            errors.push({code: 400, 
                        msg: 'invalid idSecondary',
                        detail: `idSecondary is required`
                        })      
        else if(idSecondary){
            const existIdSecondary = await CriterionType.exists({idSecondary: { $regex : new RegExp(idSecondary, "i") }})
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
            if(existIdSecondary)
                errors.push({code: 400, 
                                msg: 'invalid idSecondary',
                                detail: `${idSecondary} is already in use`
                            })
        }
        if(!name || name.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name',
                            detail: `name is required`
                        })
        else if(name){
            const existName = await CriterionType.exists({name: { $regex : new RegExp(name, "i") }})
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
        const newCriterionType = new CriterionType({
            idSecondary: idSecondary,
            name: name
        })
        await newCriterionType.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })
        response.status(201).json({code: 201,
                                    msg: 'the CriterionType has been created successfully',
                                    data: newCriterionType })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateCriterionType = async(request, response) => {
    try{
        const {id} = request.params
        const {idSecondary, name} = request.body
        let errors = []
        if(id && ObjectId.isValid(id)){
            const existId = await CriterionType.exists({_id: id})
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
        if(idSecondary){
            if(idSecondary.length < 1){
                errors.push({code: 400, 
                            msg: 'invalid idSecondary',
                            detail: `idSecondary is required`
                            })
            }
            else{
                const existIdSecondary = await CriterionType.findOne({idSecondary: { $regex : new RegExp(idSecondary, "i") }})
                                                        .catch(error => {        
                                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                        })
                if(existIdSecondary && existIdSecondary._id.toString() !== id)
                    errors.push({code: 400, 
                                msg: 'invalid existIdSecondary',
                                detail: `${idSecondary} is already in use`
                                })
            }
        }
        if(name){
            if(name.length < 1){
                errors.push({code: 400, 
                                msg: 'invalid name',
                                detail: `name is required`
                            })
            }
            else{
                const existName = await CriterionType.findOne({name: { $regex : new RegExp(name, "i") }})
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
        if(errors.length > 0)
            return response.status(400).json({errors: errors})
        const updatedFields = {}
        if(idSecondary)
            updatedFields['idSecondary'] = idSecondary
        if(name)
            updatedFields['name'] = name
        updatedFields['updatedAt'] = Date.now()
        const updatedCriterionType = await CriterionType.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        response.status(201).json({code: 200,
                                    msg: 'the CriterionType has been updated successfully',
                                    data: updatedCriterionType })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteCriterionType = async(request, response) => {
    try{
        const {id} = request.params
        if(id && ObjectId.isValid(id)){
            const existId = await CriterionType.exists({_id: id})
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
        const deletedCriterionType = await CriterionType.findByIdAndDelete(id)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
        response.status(201).json({code: 201,
                                    msg: 'the CriterionType has been deleted successfully',
                                    data: deletedCriterionType })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllCriterionType= async(request, response) => {
    try{
        const {idSecondary, name, pageReq} = request.body
        const page = !pageReq ? 0 : pageReq
        let skip = (page - 1) * 10
        const filter = {}
        if(idSecondary)
            filter['idSecondary'] = { $regex : new RegExp(idSecondary, "i") }
        if(name)
            filter['name'] = { $regex : new RegExp(name, "i") }
        if(page === 0){
            const criterionTypes = await CriterionType.find(filter)
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {criterionTypes: criterionTypes, 
                          totalPages: 1}
            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
        let countDocs = await CriterionType.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)
        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})
        const criterionTypes = await CriterionType.find(filter).skip(skip).limit(10)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        const data = {criterionTypes: criterionTypes, 
                      totalPages: countPage}
        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getCriterionType = async(request, response) => {
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
        const criterion = await CriterionType.findById(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
    
        if(criterion){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: criterion})
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

module.exports = {createCriterionType, updateCriterionType, deleteCriterionType, getAllCriterionType, getCriterionType}