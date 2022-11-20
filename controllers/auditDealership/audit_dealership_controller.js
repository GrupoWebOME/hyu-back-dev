const Audit = require('../../models/audit_model')
const Dealership = require('../../models/dealership_model')
const AuditDealership = require('../../models/audit_dealership_model')
const ObjectId = require('mongodb').ObjectId

const createAuditDealership = async(request, response) => {
    try{
        let { electric_quaterly_billing, ionic5_quaterly_billing, vn_quaterly_billing, audit_id, dealership_id } = request.body
        let errors = []

        if(audit_id && ObjectId.isValid(audit_id)){
            const auditById = await Audit.findById(audit_id)
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!auditById){
                errors.push({code: 400, 
                    msg: 'invalid audit_id',
                    detail: `audit_id not found`
                })
            }
        }
        else{
            errors.push({code: 400, 
                msg: 'invalid audit_id',
                detail: `audit_id should be an ObjectId type`
            })
        }

        if(dealership_id && ObjectId.isValid(dealership_id)){
            const auditById = await Dealership.findById(dealership_id)
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!auditById){
                errors.push({code: 400, 
                    msg: 'invalid dealership_id',
                    detail: `dealership_id not found`
                })
            }
        }
        else{
            errors.push({code: 400, 
                msg: 'invalid dealership_id',
                detail: `dealership_id should be an ObjectId type`
            })
        }

        if(dealership_id && ObjectId.isValid(dealership_id) && audit_id && ObjectId.isValid(audit_id)){
            const auditDeal = await AuditDealership.findOne({dealership_id: dealership_id, audit_id: audit_id})
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(auditDeal){
                errors.push({code: 400, 
                    msg: 'invalid dealership_id',
                    detail: `dealership_id already exists for this audit_id`
                })
            }
        }

        if(errors.length > 0)
            return response.status(400).json({errors: errors})
       
        const newAuditDealership = new AuditDealership({
            electric_quaterly_billing, 
            ionic5_quaterly_billing, 
            vn_quaterly_billing, 
            audit_id, 
            dealership_id
        })
    
        await newAuditDealership.save()
                    .catch(error => {        
                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                    })
                    
        response.status(201).json({code: 201,
                                    msg: 'the auditDealership has been created successfully',
                                    data: newAuditDealership })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateAuditDealership = async(request, response) => {
    try{
        let { electric_quaterly_billing, ionic5_quaterly_billing, vn_quaterly_billing } = request.body
        const {id} = request.params

        let auditDealershipById = null
        if(id && ObjectId.isValid(id)){
            auditDealershipById = await AuditDealership.findById(id)
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!auditDealershipById)
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

        let updatedFields = {}

        if(electric_quaterly_billing !== null && electric_quaterly_billing !== undefined)
            updatedFields['electric_quaterly_billing'] = electric_quaterly_billing
        if(ionic5_quaterly_billing !== null && ionic5_quaterly_billing !== undefined)
            updatedFields['ionic5_quaterly_billing'] = ionic5_quaterly_billing
        if(vn_quaterly_billing !== null && vn_quaterly_billing !== undefined)
            updatedFields['vn_quaterly_billing'] = vn_quaterly_billing
        updatedFields['updatedAt'] = Date.now()
        
        const updatedAuditDealership = await AuditDealership.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        response.status(200).json({code: 200,
                                    msg: 'the AuditDealership has been updated successfully',
                                    data: updatedAuditDealership })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteAuditDealership = async(request, response) => {
    try{
        const {id} = request.params
        if(id && ObjectId.isValid(id)){
            const existId = await AuditDealership.exists({_id: id})
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
        const deletedAuditDealership = await AuditDealership.findByIdAndDelete(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        response.status(200).json({code: 200,
                                    msg: 'the AuditDealership has been deleted successfully',
                                    data: deletedAuditDealership })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllAuditDealership= async(request, response) => {

    try{
        const { id } = request.params

        const auditDealerships = await AuditDealership.find({audit_id: id})

        return response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: auditDealerships })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

module.exports = { createAuditDealership, updateAuditDealership, deleteAuditDealership, getAllAuditDealership }
