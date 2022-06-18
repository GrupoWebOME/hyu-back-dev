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
                                                .populate({path: 'installation_id', select: '_id name code installation_type sales_weight_per_installation post_sale_weight_per_installation', 
                                                           populate: {path: 'installation_type', select: '_id code'}})
                                                .populate({ path: 'criterions.criterion_id', 
                                                            populate: {
                                                                path: 'standard block area category auditResponsable criterionType installationType',
                                                                select: 'name code description isCore number abbreviation'
                                                            },
                                                        }) 
                                            
        auditsResults.forEach((element) => {
            const orderedCriterionsArray = element.criterions.sort(function (a, b) {
                if (a.criterion_id.standard._id.toString() > b.criterion_id.standard._id.toString()) {
                  return 1;
                }
                if (a.criterion_id.standard._id.toString() < b.criterion_id.standard._id.toString()) {
                  return -1;
                }
                return 0;
            })
            orderedCriterionsArray.forEach((criterion) => {
                if(criterion.criterion_id.standard.isCore && !criterion.pass){
                    orderedCriterionsArray.filter((el, index) => {
                       if(criterion.criterion_id.standard._id.toString() === el.criterion_id.standard._id.toString()){
                            orderedCriterionsArray[index].pass = false
                       }
                    })
                }
            })
        })

        instalations_audit_details = []

        const VENTA = "6233b3ace74b428c2dcf3068"
        const POSVENTA = "6233b450e74b428c2dcf3091"

        auditsResults.forEach((element) => {

            let installationAuditData = {}
            installationAuditData['installation'] =  element.installation_id
            let actualCategoryID = ''
            let actualCategoryName = ''
            let accum = 0
            let totalAccum = 0
            let totalCriterionsByCat = 0
            let categories = []
            element.criterions.forEach((criterion, index) => {
                let multiplicator = 1
                if(actualCategoryID === VENTA){
                    if(element.installation_id.sales_weight_per_installation !== null){
                        multiplicator = element.installation_id.sales_weight_per_installation/100
                    }
                    else{
                        multiplicator = 1
                    }
                }
                else if(actualCategoryID === POSVENTA){
                    if(element.installation_id.post_sale_weight_per_installation !== null){
                        multiplicator = element.installation_id.post_sale_weight_per_installation/100
                    }
                    else{
                        multiplicator = 1
                    }
                }
                else{
                    multiplicator = 1
                }
                if((criterion.criterion_id.category._id.toString() !== actualCategoryID) && index !== 0){
                    const perc = ((accum * 100)/totalAccum) * multiplicator
                    const percByCrit = totalCriterionsByCat * 100 / element.criterions.length
                    categories = [...categories, {
                        id: actualCategoryID,
                        name: actualCategoryName,
                        pass: accum,
                        total: totalAccum,
                        totalCriterionsPercByCat: percByCrit * perc / 100,
                        percentage: perc,
                    }]
                    totalCriterionsByCat = 0
                    actualCategoryID = criterion.criterion_id.category._id.toString()
                    actualCategoryName = criterion.criterion_id.category.name
                    if(criterion.pass){
                        accum = criterion.criterion_id.value
                    }
                    else{
                        accum = 0
                    }
                    accum = criterion.criterion_id.value
                    totalAccum = criterion.criterion_id.value
                    totalCriterionsByCat += 1
                }
                else{
                    if(criterion.pass)
                        accum += criterion.criterion_id.value
                    if(index === 0){
                        actualCategoryName = criterion.criterion_id.category.name
                        actualCategoryID = criterion.criterion_id.category._id.toString()
                    }
                    totalAccum += criterion.criterion_id.value
                    totalCriterionsByCat += 1
                    if(index === (element.criterions.length - 1)){
                        const perc = ((accum * 100)/totalAccum) * multiplicator
                        const percByCrit = totalCriterionsByCat * 100 / element.criterions.length
                        categories = [...categories, {
                            id: criterion.criterion_id.category._id.toString(),
                            name: criterion.criterion_id.category.name,
                            pass: accum,
                            total: totalAccum,
                            totalCriterionsPercByCat: percByCrit * perc / 100,
                            percentage: perc,
                        }]
                        let totalResult = 0
                        categories.forEach((category) => {
                            totalResult += (category.pass * 100)/category.total
                        })
                        auditTotalResult = totalResult / categories.length
                        categories = [...categories, {auditTotalResult: auditTotalResult}]
                        installationAuditData['categories'] =  categories
                    }
                }
            })
            instalations_audit_details = [...instalations_audit_details, installationAuditData]
        })

        let accumAgency = 0
        instalations_audit_details.forEach((installation) => {
            accumAgency += installation.categories[installation.categories.length - 1].auditTotalResult
        })

        agency_audit_details = accumAgency / instalations_audit_details.length

        let data = {
            dealership_details: dealershipByID,
            audit_criterions_details: auditsResults,
            instalations_audit_details: instalations_audit_details,
            agency_audit_details: agency_audit_details
        }

        return response.status(200).json({data: data})
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAuditResByAuditIDAndInstallationID = async(request, response) => {
    try{
        const {auditid, installationid} = request.params

        //Validations
        if(!auditid)
            return response.status(400).json({code: 400,
                                                msg: 'invalid auditid',
                                                detail: 'id is a obligatory field'})
        if(auditid && !ObjectId.isValid(auditid))
            return response.status(400).json({code: 400,
                                              msg: 'invalid auditid',
                                              detail: 'auditid should be an objectId'})

        if(!installationid)
            return response.status(400).json({code: 400,
                                                msg: 'invalid installationid',
                                                detail: 'id is a obligatory field'})
        if(installationid && !ObjectId.isValid(installationid))
            return response.status(400).json({code: 400,
                                            msg: 'invalid installationid',
                                            detail: 'installationid should be an objectId'})
    
        const auditRes = await AuditResults.findOne({audit_id: auditid, installation_id: {$in: [installationid]}})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
    
        if(auditRes){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: auditRes})
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

module.exports = {createAuditResults, updateAuditResults, deleteAuditResults, getDataForTables, getAuditResByAuditIDAndInstallationID}
