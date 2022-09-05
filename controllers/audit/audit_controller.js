const Audit = require('../../models/audit_model')
const InstallationType = require('../../models/installationType_model')
const Installation = require('../../models/installation_schema')
const ObjectId = require('mongodb').ObjectId

const createAudit = async(request, response) => {
    try{
        let {name, installation_type, initial_date, end_date, criterions, isAgency, installation_exceptions} = request.body
        const regexDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
        let errors = []
        if(!name)
            errors.push({code: 400, 
                         msg: 'invalid name',
                         detail: 'name is an obligatory field'
                        })
        else{
            const audit = await Audit.exists({name: { $regex : new RegExp(name, "i") } })
            const audit2 = await Audit.exists({name: name })
            if(audit || audit2)
                errors.push({code: 400, 
                             msg: 'invalid name',
                             detail: `${name} is in use`
                            })
        }
        if(installation_type && !Array.isArray(installation_type)){
            errors.push({code: 400, 
                msg: 'invalid installation_type',
                detail: `installation_type should be an array type`
            })
        }
        else if(installation_type){
            installation_type.forEach(async(element) => {
                if(!ObjectId.isValid(element)){
                    errors.push({code: 400, 
                        msg: 'invalid installation_type',
                        detail: `${element} is not an ObjectId`
                    })  
                }
                else{                
                    const existInstallationType = await InstallationType.exists({_id: element})
                    if(!existInstallationType)
                        errors.push({code: 400, 
                                    msg: 'invalid installation_type',
                                    detail: `${element} not found`
                                    })        
                }
            })
        }
        if(!initial_date){
            errors.push({code: 400, 
                            msg: 'invalid initial_date',
                            detail: `initial_date is required`
                        })
        }
        else if(initial_date && !initial_date.match(regexDate)){
            errors.push({code: 400, 
                msg: 'invalid initial_date',
                detail: `initial_date should be yyyy-mm-dd format`
            })
        }
        else{
            const arrayDate = initial_date.split('-')
            if(arrayDate[1].length<2)
                arrayDate[1] = '0'+arrayDate[1]
            if(arrayDate[2].length<2)
                arrayDate[2] = '0'+arrayDate[2]
            initial_date = `${arrayDate[0]}-${arrayDate[1]}-${arrayDate[2]}`
        }

        if(end_date && end_date.match(regexDate)){
            const arrayDate = end_date.split('-')
            if(arrayDate[1].length<2)
                arrayDate[1] = '0'+arrayDate[1]
            if(arrayDate[2].length<2)
                arrayDate[2] = '0'+arrayDate[2]
            end_date = `${arrayDate[0]}-${arrayDate[1]}-${arrayDate[2]}`
        }
        if(end_date && !end_date.match(regexDate) || initial_date > end_date){
            errors.push({code: 400, 
                msg: 'invalid end_date',
                detail: `end_date should be yyyy-mm-dd format, and should be >= initial_date`
            })
        }
        if(!criterions || (criterions && (criterions.length <= 0 || !Array.isArray(criterions)))){
            errors.push({code: 400, 
                         msg: 'invalid criterions',
                         detail: `criterions is a obligatory field, and should be an array type`
                })  
        }
        else{
            for(let i = 0; i < criterions.length; i++){
                if(!criterions[i].hasOwnProperty("criterion"))
                    errors.push({code: 400, 
                        msg: 'invalid criterion',
                        detail: `criterion field in criterions is an obligatory field`
                }) 
            }
        }
        if(installation_exceptions && (installation_exceptions.length <= 0 || !Array.isArray(installation_exceptions))){
            errors.push({code: 400, 
                         msg: 'invalid criterions',
                         detail: `installation_exceptions should be an array type`
                })  
        }
        else if(installation_exceptions){
            installation_exceptions.forEach(async(element) => {
                if(!ObjectId.isValid(element)){
                    errors.push({code: 400, 
                        msg: 'invalid installation_exceptions',
                        detail: `${element} is not an ObjectId`
                    })  
                }
                else{                
                    const existInstallation = await Installation.exists({_id: element})
                    if(!existInstallation)
                        errors.push({code: 400, 
                                    msg: 'invalid installation_exceptions',
                                    detail: `${element} not found`
                                    })        
                }
            })
        }
        if(isAgency!==null && isAgency!==undefined && typeof isAgency !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isAgency',
                        detail: `isAgency should be a boolean type`
                        }) 
        if(errors.length > 0)
            return response.status(400).json({errors: errors})
        const newAudit = new Audit({
            name: name,
            installation_type,
            initial_date,
            end_date: end_date? end_date : null,
            criterions,
            isAgency: (isAgency && isAgency === true)? true : false,
            status: 'created'
        })
        await newAudit.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error 2', detail: error.message}]})
                        })
        response.status(201).json({code: 201,
                                    msg: 'the audit has been created successfully',
                                    data: newAudit })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateAudit = async(request, response) => {
    try{
        let {name, installation_type, initial_date, end_date, criterions, isAgency, installation_exceptions, status} = request.body
        const {id} = request.params
        const regexDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
        let errors = []
        let auditById = null
        if(id && ObjectId.isValid(id)){
            auditById = await Audit.findById(id)
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!auditById)
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
        if(end_date && end_date.match(regexDate)){
            const arrayDate = end_date.split('-')
            if(arrayDate[1].length<2)
                arrayDate[1] = '0'+arrayDate[1]
            if(arrayDate[2].length<2)
                arrayDate[2] = '0'+arrayDate[2]
            end_date = `${arrayDate[0]}-${arrayDate[1]}-${arrayDate[2]}`
        }
        if(initial_date && initial_date.match(regexDate)){
            const arrayDate = initial_date.split('-')
            if(arrayDate[1].length<2)
                arrayDate[1] = '0'+arrayDate[1]
            if(arrayDate[2].length<2)
                arrayDate[2] = '0'+arrayDate[2]
            initial_date = `${arrayDate[0]}-${arrayDate[1]}-${arrayDate[2]}`
        }
        if(name){
            const audit = await Audit.exists({name: { $regex : new RegExp(name, "i") } })
            const audit2 = await Audit.exists({name: name })
            if((audit || audit2) && name !== auditById.name)
                errors.push({code: 400, 
                             msg: 'invalid name',
                             detail: `${name} is in use`
                            })
        }
        if(installation_type && !Array.isArray(installation_type)){
            errors.push({code: 400, 
                msg: 'invalid installation_type',
                detail: `installation_type should be an array type`
            })
        }
        else if(installation_type){
            installation_type.forEach(async(element) => {
                if(!ObjectId.isValid(element)){
                    errors.push({code: 400, 
                        msg: 'invalid installation_type',
                        detail: `${element} is not an ObjectId`
                    })  
                }
                else{                
                    const existInstallationType = await InstallationType.exists({_id: element})
                    if(!existInstallationType)
                        errors.push({code: 400, 
                                    msg: 'invalid installation_type',
                                    detail: `${element} not found`
                                    })        
                }
            })
        }
        if(initial_date && (!initial_date.match(regexDate) || initial_date > end_date)){
            errors.push({code: 400, 
                msg: 'invalid initial_date',
                detail: `initial_date should be yyyy-mm-dd format, and initial_date should be <= end_date`
            })
        }
        if(end_date && !end_date.match(regexDate) || initial_date > end_date){
            errors.push({code: 400, 
                msg: 'invalid end_date',
                detail: `end_date should be yyyy-mm-dd format`
            })
        }
        if(isAgency!==null && isAgency!==undefined && typeof isAgency !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isAgency',
                        detail: `isAgency should be a boolean type`
                        }) 
        if(criterions && (criterions && (criterions.length <= 0 || !Array.isArray(criterions)))){
            errors.push({code: 400, 
                            msg: 'invalid criterions',
                            detail: `criterions is a obligatory field, and should be an array type`
                })  
        }
        else if(criterions){
            for(let i = 0; i < criterions.length; i++){
                if(!criterions[i].hasOwnProperty("criterion"))
                    errors.push({code: 400, 
                        msg: 'invalid criterion',
                        detail: `criterion field in criterions is an obligatory field`
                    }) 
            }
        }

        if(installation_exceptions && (installation_exceptions.length <= 0 || !Array.isArray(installation_exceptions))){
            errors.push({code: 400, 
                         msg: 'invalid criterions',
                         detail: `installation_exceptions should be an array type`
                })  
        }
        else if(installation_exceptions){
            installation_exceptions.forEach(async(element) => {
                if(!ObjectId.isValid(element)){
                    errors.push({code: 400, 
                        msg: 'invalid installation_exceptions',
                        detail: `${element} is not an ObjectId`
                    })  
                }
                else{                
                    const existInstallation = await Installation.exists({_id: element})
                    if(!existInstallation)
                        errors.push({code: 400, 
                                    msg: 'invalid installation_exceptions',
                                    detail: `${element} not found`
                                    })        
                }
            })
        }

        if(status !== null && status !== undefined && status !== 'created' && status !== 'canceled' && status !== 'planned' &&
           status !== 'in_process' && status !== 'auditor_signed' && status !== 'auditor_end' && status !== 'closed' ){
                errors.push({code: 400, 
                             msg: 'invalid status',
                             detail: `status should be created, canceled, planned, in_process, auditor_signed, auditor_end, or closed`
                            })  
           }

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}
        
        if(name)
            updatedFields['name'] = name
        if(installation_type)
            updatedFields['installation_type'] = installation_type
        if(initial_date)
            updatedFields['initial_date'] = initial_date
        if(end_date)
            updatedFields['end_date'] = end_date
        if(criterions)
            updatedFields['criterions'] = criterions
        if(isAgency !== null && isAgency !== undefined)
            updatedFields['isAgency'] = isAgency
        if(status)
            updatedFields['status'] = status
        updatedFields['updatedAt'] = Date.now()
        const updatedAudit = await Audit.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        response.status(200).json({code: 200,
                                    msg: 'the Audit has been updated successfully',
                                    data: updatedAudit })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteAudit = async(request, response) => {
    try{
        const {id} = request.params
        if(id && ObjectId.isValid(id)){
            const existId = await Audit.exists({_id: id})
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
        const deletedAudit = await Audit.findByIdAndDelete(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        response.status(201).json({code: 200,
                                    msg: 'the Audit has been deleted successfully',
                                    data: deletedAudit })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllAudit= async(request, response) => {
    try{
        const { name, installation_type, start_date, end_date, pageReq} = request.body
        const page = !pageReq ? 0 : pageReq
        let skip = (page - 1) * 10
        const filter = {}
        if(installation_type && !ObjectId.isValid(installation_type)){
            return response.status(400).json({code: 400, 
                                              msg: 'invalid installation_type',
                                              detail: `format should be a ObjectId`
                                            })  
        }
        if(name)
            filter['name'] = { $regex : new RegExp(name, "i") } 
        if(installation_type)
            filter['installation_type'] = installation_type
        if(start_date && end_date){
            filter['start_date'] = {$gt : start_date}
            filter['end_date'] = {$lt : end_date}
        }
        if(page === 0){
            const audits = await Audit.find(filter).populate("installation_type criterions.criterion")
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {audits: audits, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
        let countDocs = await Audit.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)
        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400, 
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})
        const audits = await Audit.find(filter).skip(skip).limit(10).populate("installation_type criterions.criterion")
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        const data = {audits: audits, 
                      totalPages: countPage}
        return response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getAudit = async(request, response) => {
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
        const audit = await Audit.findById(id).populate("installation_type")
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        if(audit){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: audit})
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

const getAllUpdateAudit= async(request, response) => {
    const {totalResults} = request.params
    try{
        const audits = await Audit.find().limit(parseInt(totalResults)).sort({updatedAt: -1}).populate("installation_type criterions.criterion")
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        const data = {audits: audits}
        return response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}


module.exports = {createAudit, updateAudit, deleteAudit, getAllAudit, getAudit, getAllUpdateAudit}
