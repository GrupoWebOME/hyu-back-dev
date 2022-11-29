const Audit = require('../../models/audit_model')
const AuditInstallation = require('../../models/audit_installation_model')
const InstallationType = require('../../models/installationType_model')
const Installation = require('../../models/installation_schema')
const Admin = require('../../models/admin_model')
const ObjectId = require('mongodb').ObjectId

const createAudit = async(request, response) => {
    try{
        let {name, installation_type, initial_date, end_date, criterions, isAgency, installation_exceptions, auditMVE, auditElectrics, auditIonic5, isCustomAudit} = request.body
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
        if(isCustomAudit!==null && isCustomAudit!==undefined && typeof isCustomAudit !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isCustomAudit',
                        detail: `isCustomAudit should be a boolean type`
                        }) 
        if(auditIonic5!==null && auditIonic5!==undefined && typeof auditIonic5 !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid auditIonic5',
                        detail: `auditIonic5 should be a boolean type`
                        }) 
        if(auditElectrics!==null && auditElectrics!==undefined && typeof auditElectrics !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid auditElectrics',
                        detail: `auditElectrics should be a boolean type`
                        }) 
        if(auditMVE!==null && auditMVE!==undefined && typeof auditMVE !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid auditMVE',
                        detail: `auditMVE should be a boolean type`
                        }) 
        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const newAudit = new Audit({
            name: name,
            installation_type,
            initial_date,
            end_date: end_date? end_date : null,
            criterions,
            isAgency: (isAgency !== null && isAgency !== undefined  && isAgency === true)? true : false,
            isCustomAudit: (isCustomAudit !== null && isCustomAudit !== undefined && isCustomAudit === true)? true : false,
            auditIonic5: (auditIonic5 !== null && auditIonic5 !== undefined  && auditIonic5 === false)? false : true,
            auditElectrics: (auditElectrics !== null && auditElectrics !== undefined && auditElectrics === false)? false : true,
            auditMVE: (auditMVE !== null && auditMVE !== undefined  && auditMVE === false)? false : true,
            installation_exceptions: installation_exceptions? installation_exceptions : []
        })

        await newAudit.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error 2', detail: error.message}]})
                        })
                    
        response.status(201).json({code: 201,
                                    msg: 'the audit has been created successfully',
                                    data: newAudit })
                                    
        //Get all installation for installation type and not in exceptions
        const installationsFind = await Installation.find({$and: [{installation_type: {$in: installation_type}},{_id: {$nin: installation_exceptions}}]})

        //Create for all auditinstallation
        for(let i = 0; i < installationsFind.length; i++) {
            const newAuditInstallation = new AuditInstallation({
                installation_id: installationsFind[i]._id,
                dealership_id: installationsFind[i].dealership,
                audit_id: newAudit._id,
                audit_status: 'created'
            })
            await newAuditInstallation.save()
        }

    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateAudit = async(request, response) => {
    try{
        let {name, installation_type, initial_date, end_date, criterions, isAgency, installation_exceptions, auditMVE, auditElectrics, auditIonic5, isCustomAudit, audits} = request.body
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
        if(isCustomAudit!==null && isCustomAudit!==undefined && typeof isCustomAudit !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid isCustomAudit',
                        detail: `isCustomAudit should be a boolean type`
                        }) 
        if(auditIonic5!==null && auditIonic5!==undefined && typeof auditIonic5 !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid auditIonic5',
                        detail: `auditIonic5 should be a boolean type`
                        })    
        if(auditElectrics!==null && auditElectrics!==undefined && typeof auditElectrics !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid auditElectrics',
                        detail: `auditElectrics should be a boolean type`
                        })       
        if(auditMVE!==null && auditMVE!==undefined && typeof auditMVE !== 'boolean')
            errors.push({code: 400, 
                        msg: 'invalid auditMVE',
                        detail: `auditMVE should be a boolean type`
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
        if(auditIonic5 !== null && auditIonic5 !== undefined)
            updatedFields['auditIonic5'] = auditIonic5
        if(auditElectrics !== null && auditElectrics !== undefined)
            updatedFields['auditElectrics'] = auditElectrics
        if(auditMVE !== null && auditMVE !== undefined)
            updatedFields['auditMVE'] = auditMVE
        if(isCustomAudit !== null && isCustomAudit !== undefined)
            updatedFields['isCustomAudit'] = isCustomAudit
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

        await AuditResults.deleteMany({audit_id: id})
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
        const {role, dealership, _id} = request.jwt.admin
        const page = !pageReq ? 0 : pageReq
        let skip = (page - 1) * 10
        const filter = {}
        let filterNo = {}
        let countDocsNo = 0
        let arrayAuditInstNoPass = []

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
        
        let filterAuditInst = {}
        
        if(role === 'dealership'){
            filterAuditInst['audit_status'] = {$in: ['closed', 'canceled', 'review', 'planned', 'review_hmes', 'in_process', 'auditor_signed', 'auditor_end', 'finished']}
            // Traigo todas las instalaciones que tiene esa agencia
            const installationsForDealerships = await Installation.find({dealership: dealership})
            let arrayInst = []
            let arrayAuditInstPass = []

            // Armo un array de ids de instalaciones que pertenecen a esa agencia
            installationsForDealerships.forEach((inst) => {
                arrayInst.push(inst._id)
            })

            // Busco dentro de las auditinstalations aquellas que contengan las instalaciones del array
            const auditInstallationForDealerships = await AuditInstallation.find({installation_id: {$in: arrayInst}})

            // Armo un array de las auditorias que afectan a las instalaciones de la agencia
            auditInstallationForDealerships.forEach((auditInst) => {
                if(!arrayAuditInstPass.includes(auditInst.audit_id.toString())){
                    arrayAuditInstPass.push(auditInst.audit_id.toString())
                }
            })

            // Del array de auditorias obtenido, elimino aquellas cuyo estado no sea closed
            auditInstallationForDealerships.forEach((audtInst) => {
                if(audtInst.audit_status !== 'closed' && audtInst.audit_status !== 'canceled' && audtInst.audit_status !== 'review' && audtInst.audit_status !== 'planned'){
                    const index = arrayAuditInstPass.indexOf(audtInst.audit_id.toString())
                    if(index > -1){
                        arrayAuditInstPass.splice(index, 1)
                    }
                    const indexNo = arrayAuditInstNoPass.indexOf(audtInst.audit_id.toString())
                    if(indexNo < 0){
                        arrayAuditInstNoPass.push(audtInst.audit_id.toString())
                    }
                }
            })

            // elimino los que tengan created
            auditInstallationForDealerships.forEach((audtInst) => {
                if(audtInst.audit_status === 'created'){
                    const index = arrayAuditInstNoPass.indexOf(audtInst.audit_id.toString())
                    if(index > -1){
                        arrayAuditInstNoPass.splice(index, 1)
                    }
                }
            })
            
            filter['_id'] = {$in: arrayAuditInstPass}
            filterNo['_id'] = {$in: arrayAuditInstNoPass}
        }

        else if(role === 'auditor'){
            filterAuditInst['audit_status'] = {$in: ['planned', 'in_process']}

            const auditorAdmin = await Admin.findById(_id)
            
            let arrayAuditInstPass = []
            let arrayAuditsOk = []

            auditorAdmin.audits.forEach((audit) => {
                arrayAuditInstPass = [...arrayAuditInstPass, audit.audit.toString()]
            })

            let auditInstallationForDealerships = await AuditInstallation.find({audit_id: {$in: arrayAuditInstPass}, audit_status: {$in: ['planned', 'in_process']}})
            
            auditInstallationForDealerships.forEach((audtInst) => {
                if(audtInst.audit_status === 'planned' || audtInst.audit_status === 'in_process'){
                    const index = arrayAuditsOk.indexOf(audtInst.audit_id.toString())
                    if(index < 0){
                        arrayAuditsOk = [...arrayAuditsOk, audtInst.audit_id.toString()]
                    }
                }
            })

            filter['_id'] = {$in: arrayAuditsOk}
        }

        else if(role === 'superauditor'){
            filterAuditInst['audit_status'] = {$in: ['planned', 'in_process', 'auditor_signed']}

            const auditorAdmin = await Admin.findById(_id)
            
            let arrayAuditInstPass = []
            let arrayAuditsOk = []

            auditorAdmin.audits.forEach((audit) => {
                arrayAuditInstPass = [...arrayAuditInstPass, audit.audit.toString()]
            })

            let auditInstallationForDealerships = await AuditInstallation.find({audit_id: {$in: arrayAuditInstPass}, audit_status: {$in: ['planned', 'in_process', 'auditor_signed']}})

            // Del array de auditorias obtenido, elimino aquellas cuyo estado no sea closed
            auditInstallationForDealerships.forEach((audtInst) => {
                if(audtInst.audit_status === 'planned' || audtInst.audit_status === 'in_process'){
                    const index = arrayAuditsOk.indexOf(audtInst.audit_id.toString())
                    if(index < 0){
                        arrayAuditsOk = [...arrayAuditsOk, audtInst.audit_id.toString()]
                    }
                }
            })

            filter['_id'] = {$in: arrayAuditsOk}
        }

        if(page === 0){

            const audits = await Audit.find(filter).populate("installation_type criterions.criterion")
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })

            let auditsNo = []

            if(arrayAuditInstNoPass.length > 0){
                auditsNo = await Audit.find(filterNo).select('name installation_type initial_date end_date isAgency auditMVE auditElectrics auditIonic5 isCustomAudit')
                .catch(error => {        
                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                })
            }
            
            const data = {audits: audits.concat(auditsNo), 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }

        let countDocs = await Audit.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        if(arrayAuditInstNoPass.length > 0){
            countDocsNo = await Audit.countDocuments(filterNo)
            .catch(error => {        
               return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
            })
        }

        countDocs = countDocs + countDocsNo

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)
        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400, 
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})
        const audits = await Audit.find(filter).skip(skip).limit(10).populate("installation_type criterions.criterion")
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        let auditsNo = []

        if(arrayAuditInstNoPass.length > 0){
            auditsNo = await Audit.find(filterNo).select('name installation_type initial_date end_date isAgency auditMVE auditElectrics auditIonic5 isCustomAudit')
            .catch(error => {        
                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
            })
        }

        const data = {audits: audits.concat(auditsNo), 
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
