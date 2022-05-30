const Audit = require('../../models/audit_model')
const Dealership = require('../../models/dealership_model')
const AuditResults = require('../../models/audit_results_model')
const Criterion = require('../../models/criterion_model')
const Installation = require('../../models/installation_schema')
const ObjectId = require('mongodb').ObjectId

const createAuditResults = async(request, response) => {
    try{
        const {audit_id, installation_id, criterions} = request.body

        let errors = []

        if(!audit_id){
            errors.push({code: 400, 
                         msg: 'invalid audit_id',
                         detail: 'audit_id is an obligatory field'
                        })
        }
        else{
            if(!ObjectId.isValid(audit_id)){
                errors.push({code: 400, 
                    msg: 'invalid audit_id',
                    detail: `${audit_id} is not an ObjectId`
                })  
            }
            else{
                const existAudit = await Audit.exists({_id: audit_id})
                if(!existAudit)
                    errors.push({code: 400, 
                                msg: 'invalid audit_id',
                                detail: `${audit_id} not found`
                                })   
            }
        }

        if(!installation_id){
            errors.push({code: 400, 
                         msg: 'invalid installation_id',
                         detail: 'installation_id is an obligatory field'
                        })
        }
        else{
            if(!ObjectId.isValid(installation_id)){
                errors.push({code: 400, 
                    msg: 'invalid installation_id',
                    detail: `${installation_id} is not an ObjectId`
                })  
            }
            else{
                const existInstallation = await Installation.exists({_id: installation_id})
                if(!existInstallation)
                    errors.push({code: 400, 
                                msg: 'invalid installation_id',
                                detail: `${installation_id} not found`
                                })   
            }
        }

        if(!criterions || !Array.isArray(criterions)){
            errors.push({code: 400, 
                msg: 'invalid criterions',
                detail: `criterions is an obligatory field, and should be an array type`
            })
        }
        else if(criterions){

            criterions.forEach(async(element) => {
                if(!element.hasOwnProperty("criterion_id") || !element.hasOwnProperty("pass")){
                    errors.push({code: 400, 
                        msg: 'invalid criterions',
                        detail: `criterions should be contains criterion_id and pass fields`
                    })
                }
                else if(!ObjectId.isValid(element.criterion_id)){
                    errors.push({code: 400, 
                        msg: 'invalid criterion_id',
                        detail: `${element.criterion_id} is not an ObjectId`
                    })  
                }
                else{                
                    const existCriterion = await Criterion.exists({_id: element.criterion_id})
                    if(!existCriterion)
                        errors.push({code: 400, 
                                    msg: 'invalid criterion_id',
                                    detail: `${element.criterion_id} not found`
                                    })        
                }
            })
        }

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const newAuditResults = new AuditResults({
            audit_id,
            installation_id,
            criterions
        })

        await newAuditResults.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })

        response.status(201).json({code: 201,
                                    msg: 'the auditResults has been created successfully',
                                    data: newAuditResults })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateAuditResults = async(request, response) => {
    try{
        const {audit_id, installation_id, criterions} = request.body
        const {id} = request.params

        let errors = []
        let audiResultstById = null

        if(id && ObjectId.isValid(id)){
            audiResultstById = await AuditResults.findById(id)
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!audiResultstById)
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

        if(audit_id){
            if(!ObjectId.isValid(audit_id)){
                errors.push({code: 400, 
                    msg: 'invalid audit_id',
                    detail: `${audit_id} is not an ObjectId`
                })  
            }
            else{
                const existAudit = await Audit.exists({_id: audit_id})
                if(!existAudit)
                    errors.push({code: 400, 
                                msg: 'invalid audit_id',
                                detail: `${audit_id} not found`
                                })   
            }
        }

        if(installation_id){
            if(!ObjectId.isValid(installation_id)){
                errors.push({code: 400, 
                    msg: 'invalid installation_id',
                    detail: `${installation_id} is not an ObjectId`
                })  
            }
            else{
                const existInstallation = await Installation.exists({_id: installation_id})
                if(!existInstallation)
                    errors.push({code: 400, 
                                msg: 'invalid installation_id',
                                detail: `${installation_id} not found`
                                })   
            }
        }

        if(!criterions || !Array.isArray(criterions)){
            errors.push({code: 400, 
                msg: 'invalid criterions',
                detail: `criterions is an obligatory field, and should be an array type`
            })
        }
        else if(criterions){
            criterions.forEach(async(element) => {
                if(!element.hasOwnProperty("criterion_id") || !element.hasOwnProperty("pass")){
                    errors.push({code: 400, 
                        msg: 'invalid criterions',
                        detail: `criterions should be contains criterion_id and pass fields`
                    })
                }
                else if(!ObjectId.isValid(element.criterion_id)){
                    errors.push({code: 400, 
                        msg: 'invalid criterion_id',
                        detail: `${element.criterion_id} is not an ObjectId`
                    })  
                }
                else{                
                    const existCriterion = await Criterion.exists({_id: element.criterion_id})
                    if(!existCriterion)
                        errors.push({code: 400, 
                                    msg: 'invalid criterion_id',
                                    detail: `${element.criterion_id} not found`
                                    })        
                }
            })
        }
        
        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}

        if(audit_id)
            updatedFields['audit_id'] = audit_id
        if(installation_id)
            updatedFields['installation_id'] = installation_id
        if(criterions)
            updatedFields['criterions'] = criterions
        updatedFields['updatedAt'] = Date.now()

        const updatedAuditResults = await AuditResults.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        response.status(200).json({code: 200,
                                    msg: 'the AuditResults has been updated successfully',
                                    data: updatedAuditResults })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteAuditResults = async(request, response) => {
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

const getDataForTables = async(request, response) => {
    const {dealership_id, audit_id} = request.body
    try{
        const dealershipByID = await Dealership.findById(dealership_id)
        if(!dealershipByID)
            return response.status(400).json({code: 404, 
                                              msg: 'invalid dealership_id',
                                              detail: 'dealership_id not found'
                                            })
        const auditsResults = await AuditResults.find({$and:[{installation_id: {$in: dealershipByID.installations}},{audit_id: audit_id}]})
                                                .populate({path: 'installation_id', select: '_id name code installation_type', 
                                                           populate: {path: 'installation_type', select: '_id code'}})
                                                .populate({ path: 'criterions.criterion_id', 
                                                            populate: {
                                                                path: 'standard block area category auditResponsable criterionType installationType',
                                                                select: 'name code description isCore number abbreviation'
                                                            },
                                                        })
        return response.status(200).json({data: auditsResults})
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}


module.exports = {createAuditResults, updateAuditResults, deleteAuditResults, getDataForTables}