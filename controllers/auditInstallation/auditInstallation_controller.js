const AuditInstallation = require('../../models/audit_installation_model')
var ObjectId = require('mongodb').ObjectId

const updateAuditInstallation = async(request, response) => {
    try{
        const {id} = request.params
        const {comment, audit_status, audit_date, photo} = request.body
        const regexDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/

        let errors = []
    
        if(!id)
            return response.status(400).json({code: 400,
                                              msg: 'invalid id',
                                              detail: 'id is a obligatory field'})

        if(id && !ObjectId.isValid(id))
            return response.status(400).json({code: 400,
                                            msg: 'invalid id',
                                            detail: 'id should be an objectId'})

        let auditInstallation = null
        
        if(id){
            auditInstallation = await AuditInstallation.findById(id)
            if (!auditInstallation)
                return response.status(404).json({code: 404,
                                                  msg: 'invalid id',
                                                  detail: 'id not found'})
        }

        if(comment !== null && comment !== undefined && comment.length < 1)
            errors.push({code: 400, 
                         msg: 'invalid comment',
                         detail: `${comment} is not valid comment format.`
                        })

        if(photo !== null && photo !== undefined && photo.length < 1)
            errors.push({code: 400, 
                         msg: 'invalid photo',
                         detail: `${photo} is not valid photo format.`
                        })

        if(audit_status !== null && audit_status !== undefined && audit_status !== 'created' && audit_status !== 'canceled' && audit_status !== 'planned' &&
            audit_status !== 'in_process' && audit_status !== 'auditor_signed' && audit_status !== 'auditor_end' && audit_status !== 'closed' ){
                errors.push({code: 400, 
                                msg: 'invalid audit_status',
                                detail: `audit_status should be created, canceled, planned, in_process, auditor_signed, auditor_end, or closed`
                            })  
        }

        if(audit_date && !audit_date.match(regexDate)){
            errors.push({code: 400, 
                msg: 'invalid audit_date',
                detail: `audit_date should be yyyy-mm-dd format`
            })
        }

        if(errors.length > 0)
            return response.status(400).json({errors: errors})
    
        const editAuditInst = {}

        if(comment)
            editAuditInst['comment'] = comment

        if(photo)
            editAuditInst['photo'] = photo

        if(audit_status)
            editAuditInst['audit_status'] = audit_status

        if(audit_date){
            editAuditInst['audit_date'] = audit_date
            editAuditInst['audit_status'] = 'planned'
        }

        editAuditInst['updatedAt'] = Date.now()

        const auditInst = await AuditInstallation.findByIdAndUpdate(id, editAuditInst, {new: true})
                                        .catch( error => {return response.status(500).json({code: 500, msg: 'created error', detail: error.message})})
        
        response.status(200).json({code: 200,
                                   msg: 'the AuditInstallation has been updated successfully',
                                   data: auditInst })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }          
}

const getAllAuditInstallation = async(request, response) => {
    try{
        const {installation_id, dealership_id, audit_id, pageReq} = request.body

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        const filter = {}

        if(installation_id)
            filter['installation_id'] = installation_id
            
        if(dealership_id)
            filter['dealership_id'] = dealership_id

        if(audit_id)
            filter['audit_id'] = audit_id
            
        if(page === 0){
            const auditInstallations = await AuditInstallation.find(filter).populate('installation_id auditor_id')

            const data = {auditInstallations: auditInstallations, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await AuditInstallation.countDocuments(filter)

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400, 
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})

        const auditInstallations = await AuditInstallation.find(filter).populate('installation_id auditor_id').skip(skip).limit(10)
        
        const data = {auditInstallations: auditInstallations, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

module.exports = {updateAuditInstallation, getAllAuditInstallation}
