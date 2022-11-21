const Audit = require('../../models/audit_model')
const Dealership = require('../../models/dealership_model')
const AuditEconomic = require('../../models/audit_economic_model')
const ObjectId = require('mongodb').ObjectId

const createAuditEconomic = async(request, response) => {
    try{
        let { electric_quaterly_billing, ionic5_quaterly_billing, vn_quaterly_billing, audit_id, dealership_id, aCobrarVN, perdidoVN, retenidoVN,
            aCobrarVE, perdidoVE, retenidoVE, variableVNaCobrar, variableVNperdido, variableVNretenido, variableElectricoACobrar, variableElectricoPerdido,
            variableElectricoRetenido, variableIonic5Acobrar, smartDealerPolicy, variableTotalAcobrar, aCobrarIoniq5, percentageTotal, percentageElectric, 
            importeRetenidoAnteriores } = request.body
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
            const auditDeal = await AuditEconomic.findOne({dealership_id: dealership_id, audit_id: audit_id})
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
       
        const newAuditEconomic = new AuditEconomic({
            electric_quaterly_billing, 
            ionic5_quaterly_billing, 
            vn_quaterly_billing, 
            audit_id, 
            dealership_id,
            aCobrarVN, 
            perdidoVN, 
            retenidoVN,
            aCobrarVE, 
            perdidoVE, 
            retenidoVE, 
            variableVNaCobrar, 
            variableVNperdido, 
            variableVNretenido, 
            variableElectricoACobrar, 
            variableElectricoPerdido,
            variableElectricoRetenido, 
            variableIonic5Acobrar, 
            smartDealerPolicy, 
            variableTotalAcobrar, 
            aCobrarIoniq5,
            percentageTotal,
            percentageElectric,
            importeRetenidoAnteriores
        })
    
        await newAuditEconomic.save()
                    .catch(error => {        
                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                    })
                    
        response.status(201).json({code: 201,
                                    msg: 'the AuditEconomic has been created successfully',
                                    data: newAuditEconomic })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateAuditEconomic = async(request, response) => {
    try{
        let { electric_quaterly_billing, ionic5_quaterly_billing, vn_quaterly_billing, aCobrarVN, perdidoVN, retenidoVN,
            aCobrarVE, perdidoVE, retenidoVE, variableVNaCobrar, variableVNperdido, variableVNretenido, variableElectricoACobrar, variableElectricoPerdido,
            variableElectricoRetenido, variableIonic5Acobrar, smartDealerPolicy, variableTotalAcobrar, aCobrarIoniq5, percentageTotal, percentageElectric, 
            importeRetenidoAnteriores } = request.body
        const {id} = request.params

        let auditEconomicById = null
        if(id && ObjectId.isValid(id)){
            auditEconomicById = await AuditEconomic.findById(id)
                                       .catch(error => {return response.status(400).json({code: 500, 
                                                                                          msg: 'error id',
                                                                                          detail: error.message
                                                                                        })} )  
            if(!auditEconomicById)
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
        if(aCobrarVN !== null && aCobrarVN !== undefined)
            updatedFields['aCobrarVN'] = aCobrarVN
        if(perdidoVN !== null && perdidoVN !== undefined)
            updatedFields['perdidoVN'] = perdidoVN
        if(retenidoVN !== null && retenidoVN !== undefined)
            updatedFields['retenidoVN'] = retenidoVN
        if(aCobrarVE !== null && aCobrarVE !== undefined)
            updatedFields['aCobrarVE'] = aCobrarVE
        if(perdidoVE !== null && perdidoVE !== undefined)
            updatedFields['perdidoVE'] = perdidoVE
        if(retenidoVE !== null && retenidoVE !== undefined)
            updatedFields['retenidoVE'] = retenidoVE
        if(variableVNaCobrar !== null && variableVNaCobrar !== undefined)
            updatedFields['variableVNaCobrar'] = variableVNaCobrar
        if(variableVNperdido !== null && variableVNperdido !== undefined)
            updatedFields['variableVNperdido'] = variableVNperdido
        if(variableVNretenido !== null && variableVNretenido !== undefined)
            updatedFields['variableVNretenido'] = variableVNretenido
        if(variableElectricoACobrar !== null && variableElectricoACobrar !== undefined)
            updatedFields['variableElectricoACobrar'] = variableElectricoACobrar
        if(variableElectricoPerdido !== null && variableElectricoPerdido !== undefined)
            updatedFields['variableElectricoPerdido'] = variableElectricoPerdido
        if(variableElectricoRetenido !== null && variableElectricoRetenido !== undefined)
            updatedFields['variableElectricoRetenido'] = variableElectricoRetenido
        if(variableIonic5Acobrar !== null && variableIonic5Acobrar !== undefined)
            updatedFields['variableIonic5Acobrar'] = variableIonic5Acobrar
        if(smartDealerPolicy !== null && smartDealerPolicy !== undefined)
            updatedFields['smartDealerPolicy'] = smartDealerPolicy
        if(variableTotalAcobrar !== null && variableTotalAcobrar !== undefined)
            updatedFields['variableTotalAcobrar'] = variableTotalAcobrar
        if(aCobrarIoniq5 !== null && aCobrarIoniq5 !== undefined)
            updatedFields['aCobrarIoniq5'] = aCobrarIoniq5
        if(percentageTotal !== null && percentageTotal !== undefined)
            updatedFields['percentageTotal'] = percentageTotal
        if(percentageElectric !== null && percentageElectric !== undefined)
            updatedFields['percentageElectric'] = percentageElectric
        if(importeRetenidoAnteriores !== null && importeRetenidoAnteriores !== undefined)
            updatedFields['importeRetenidoAnteriores'] = importeRetenidoAnteriores
        updatedFields['updatedAt'] = Date.now()
        
        const updatedAuditEconomic = await AuditEconomic.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
        response.status(200).json({code: 200,
                                    msg: 'the AuditEconomic has been updated successfully',
                                    data: updatedAuditEconomic })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteAuditEconomic = async(request, response) => {
    try{
        const {id} = request.params
        if(id && ObjectId.isValid(id)){
            const existId = await AuditEconomic.exists({_id: id})
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
        const deletedAuditEconomic = await AuditEconomic.findByIdAndDelete(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        response.status(200).json({code: 200,
                                    msg: 'the AuditEconomic has been deleted successfully',
                                    data: deletedAuditEconomic })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllAuditEconomic= async(request, response) => {

    try{
        const { audit_id, dealership_id } = request.body

        let filters = {}

        if(audit_id){
            filters = {...filters, audit_id: audit_id}
        }

        if(dealership_id){
            filters = {...filters, dealership_id: dealership_id}
        }

        const auditEconomics = await AuditEconomic.find(filters)

        return response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: auditEconomics })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

module.exports = { createAuditEconomic, updateAuditEconomic, deleteAuditEconomic, getAllAuditEconomic }
