const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../../models/admin_model')
const Dealership = require('../../models/dealership_model')
var ObjectId = require('mongodb').ObjectId

const createAdmin = async(request, response) => {
    
    try{
        const {names, surnames, emailAddress, userName, password, role, dealership} = request.body
        const adminRole = request.jwt.admin.role

        let errors = []
    
        const regExPatternNamesAndSurname = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
        const regExPatternEmailAddress= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    
        if(adminRole !== 'main' && (!role || (role.toLowerCase() !== 'dealership' && role.toLowerCase() !== 'auditor'))){
            return response.status(401).json({code: 401,
                msg: 'invalid credentials',
                detail: 'you do not have permissions for creating admin type'})
        }

        if(!role || (role.toLowerCase() !== 'admin' && role.toLowerCase() !== 'dealership' && role.toLowerCase() !== 'auditor'))
            errors.push({code: 400, 
                msg: 'invalid role',
                detail: `role should be "admin", "dealership" or "auditor"`
            })
        
        if(role && role.toLowerCase() === 'dealership'){
            if(dealership === null || dealership === undefined || !ObjectId.isValid(dealership)){
                errors.push({code: 400, 
                    msg: 'invalid dealership',
                    detail: `dealership should be an objectID format`
                })
            }
            else{
                const existDealership = await Dealership.findById(dealership)
                if(existDealership === null || existDealership === undefined){
                    errors.push({code: 400, 
                        msg: 'invalid dealership',
                        detail: `dealership not found`
                    })
                }
            }
        }

        if(!names || !names.match(regExPatternNamesAndSurname))
            errors.push({code: 400, 
                         msg: 'invalid names',
                         detail: `${names} is not valid names format. The names field can only contain letters, and is required`
                        })
    
        if(!surnames || !surnames.match(regExPatternNamesAndSurname))
            errors.push({code: 400, 
                         msg: 'invalid surnames',
                         detail: `${surnames} is not valid surnames format. The surnames field can only contain letters, and is required`
                        })
    
        if(!emailAddress || !emailAddress.match(regExPatternEmailAddress))
            errors.push({code: 400, 
                         msg: 'invalid emailAddress',
                         detail: `${emailAddress} is not valid emailAddress format. The emailAddress field can only contain a valid email, and is required`
                        })
        else{
            const admin = await Admin.exists({emailAddress: emailAddress.toLowerCase()})
            if(admin)
                errors.push({code: 400, 
                             msg: 'invalid emailAddress',
                             detail: `${emailAddress} is in use`
                            })
        }
    
        if(!userName)
            errors.push({code: 400, 
                         msg: 'invalid userName',
                         detail: `${userName} is not valid userName format. The userName field can only contain a valid userName, and is required`
                        })
        else{
            const admin = await Admin.exists({userName: userName.toLowerCase()})
            if(admin)
                errors.push({code: 400, 
                             msg: 'invalid userName',
                             detail: `${userName} is in use`
                            })
        }
    
        if(!password || password.length < 6)
            errors.push({code: 400, 
                         msg: 'invalid password',
                         detail: `${userName} is not valid password format. The password field can only contain a valid password, and is required`
                        })
    
        if(errors.length > 0)
            return response.status(400).json({errors: errors})
    
        const passwordHash = await bcrypt.hash(password, 10)
                                        .catch(error => {
                                            return response.status(500).json({errors: [{code: 500, msg: 'hash fail', detail: error.message}]})
                                        })
    
        const admin = new Admin({
            names: names,
            surnames: surnames,
            emailAddress: emailAddress,
            userName: userName,
            password: passwordHash,
            role: role.toLowerCase(),
            dealership: dealership? dealership: null
        })
    
        const token = jwt.sign(
            {admin},
            process.env.SECRET,
            {
                expiresIn: 60 * 60 * 24
            }
        )
    
        await admin.save()
        
        response.status(201).json({code: 201,
                                   msg: 'the administrator has been created successfully',
                                   data: admin })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }          
}

const loginAdmin = async(request, response) => {
    try{
        const {user, password} = request.body
        if(!user || !password){   
            return response.status(401).json({errors: [{code: 401, msg: 'unauthorized access', detail: 'invalid credentials'}]})
        }

        const admin = await Admin.findOne({$or: [{userName: user},{emailAddress: user}]})

        if (!admin)
            return response.status(401).json({errors: [{code: 401, msg: 'unauthorized access', detail: 'invalid credentials'}]})

        const passwordHash = admin.password

        const correctCred = await bcrypt.compare(password, passwordHash)
                                    .catch(error => {
                                        return response.status(500).json({errors: [{code: 500, msg: 'hash fail', detail: error.message}]})
                                    })

        if (!correctCred) 
            return response.status(401).json({errors: [{code: 401, msg: 'unauthorized access', detail: 'invalid credentials'}]})

        const token = await jwt.sign({admin},
                                     process.env.SECRET,
                                     {
                                        expiresIn: 60 * 60 * 24
                                     }
                                    )

        response.cookie('token', token, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})

        response.status(200).json({code: 200, msg: 'login success', data: {admin: admin, token: token}})
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }     

}

const updateAdmin = async(request, response) => {
    try{
        const {id} = request.params
        const {names, surnames, emailAddress, userName, password, role, dealership, audits} = request.body
        const { adminRole, _id } = request.jwt.admin
        let errors = []
    
        const regExPatternNamesAndSurname = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
        const regExPatternEmailAddress= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    
        if(!id)
            return response.status(400).json({code: 400,
                                              msg: 'invalid id',
                                              detail: 'id is a obligatory field'})

        if(id && !ObjectId.isValid(id))
            return response.status(400).json({code: 400,
                                            msg: 'invalid id',
                                            detail: 'id should be an objectId'})

        let admin = null
        
        if(id){
            admin = await Admin.findById(id)
            if(admin && (admin.role === 'admin' || admin.role === 'main') && adminRole !== 'main' && admin.id.toString() !== _id.toString()){
                return response.status(401).json({code: 401,
                            msg: 'invalid credentials',
                            detail: 'you do not have permissions to update this admin'})
            }
            if (!admin)
                return response.status(404).json({code: 404,
                                                  msg: 'invalid id',
                                                  detail: 'id not found'})
        }

        if(role !== undefined && role !== null && role.toLowerCase() !== 'admin' && role.toLowerCase() !== 'dealership' && role.toLowerCase() !== 'auditor')
            errors.push({code: 400, 
                msg: 'invalid role',
                detail: `role should be "admin", "dealership" or "auditor"`
            })
        
        if(role !== undefined && role !== null && role.toLowerCase() === 'dealership'){
            if(dealership === null || dealership === undefined || !ObjectId.isValid(dealership)){
                errors.push({code: 400, 
                    msg: 'invalid dealership',
                    detail: `dealership should be an objectID format`
                })
            }
            else{
                const existDealership = await Dealership.findById(dealership)
                if(existDealership === null || existDealership === undefined){
                    errors.push({code: 400, 
                        msg: 'invalid dealership',
                        detail: `dealership not found`
                    })
                }
            }
        }

        if(names && !names.match(regExPatternNamesAndSurname))
            errors.push({code: 400, 
                         msg: 'invalid names',
                         detail: `${names} is not valid names format. The names field can only contain letters`
                        })
    
        if(audits){
            if(!Array.isArray(audits) || audits.length < 1){
                errors.push({code: 400, 
                    msg: 'invalid audits',
                    detail: `audits should be an array type`
                   })
            } else{
                audits.forEach((element) => {
                    if(!element.hasOwnProperty('audit') || !ObjectId.isValid(element.audit)){
                        errors.push({code: 400, 
                            msg: 'invalid audit field',
                            detail: `invalid audit field in audits object && audit should be an objectID type`
                           })
                    }
                    if(!element.hasOwnProperty('dealerships') || !Array.isArray(element.dealerships) || element.dealerships.length < 1){
                        errors.push({code: 400, 
                            msg: 'invalid dealerships field',
                            detail: `invalid dealerships field in audits object && dealerships should be an array type`
                        })
                    } else{
                        element.dealerships.forEach((dealership) => {
                            if(!dealership.hasOwnProperty('dealership_id') || !ObjectId.isValid(dealership.dealership_id)){
                                errors.push({code: 400, 
                                    msg: 'invalid dealership_id field',
                                    detail: `invalid dealership_id field in audits object && dealership_id should be an ObjectID type`
                                })
                            }
                            if(!dealership.hasOwnProperty('installations') || !Array.isArray(dealership.installations)){
                                errors.push({code: 400, 
                                    msg: 'invalid installations field',
                                    detail: `invalid installations field in audits object && installations should be an array type`
                                })
                            }
                        })
                    }
                })
            }
        }

        if(surnames && !surnames.match(regExPatternNamesAndSurname))
            errors.push({code: 400, 
                         msg: 'invalid surnames',
                         detail: `${surnames} is not valid surnames format. The surnames field can only contain letters`
                        })
    
        if(emailAddress && !emailAddress.match(regExPatternEmailAddress))
            errors.push({code: 400, 
                         msg: 'invalid emailAddress',
                         detail: `${emailAddress} is not valid emailAddress format. The emailAddress field can only contain a valid email`
                        })
        else if(emailAddress){
            const adminExist = await Admin.findOne({emailAddress: emailAddress.toLowerCase()})
            if(adminExist && adminExist._id.toString() !== id)
                errors.push({code: 400, 
                             msg: 'invalid emailAddress',
                             detail: `${emailAddress} is in use`
                            })
        }
    
        if(userName && userName.length < 1)
            errors.push({code: 400, 
                         msg: 'invalid userName',
                         detail: `${userName} is not valid userName format. The userName field can only contain a valid email`
                        })
        else if(userName){
            const adminExist = await Admin.findOne({userName: userName.toLowerCase()})
            if(adminExist && adminExist._id.toString() !== id)
                errors.push({code: 400, 
                             msg: 'invalid userName',
                             detail: `${userName} is in use`
                            })
        }
    
        if(password && password.length < 6)
            errors.push({code: 400, 
                         msg: 'invalid password',
                         detail: `${userName} is not valid password format. The password field can only contain a valid email`
                        })

        if(errors.length > 0)
            return response.status(400).json({errors: errors})
    
        let passwordHash = null

        if(password){
            passwordHash = await bcrypt.hash(password, 10)
            .catch(error => {
                return response.status(500).json({errors: [{code: 500, msg: 'hash fail', detail: error.message}]})
            })
        }
    
        const editAdmin = {}

        if(names)
            editAdmin['names'] = names

        if(surnames)
            editAdmin['surnames'] = surnames

        if(emailAddress)
            editAdmin['emailAddress'] = emailAddress

        if(userName)
            editAdmin['userName'] = userName
            
        if(password)
            editAdmin['password'] = passwordHash

        if(role)
            editAdmin['role'] = role.toLowerCase()

        if(dealership)
            editAdmin['dealership'] = dealership

        if(audits)
            editAdmin['audits'] = audits

        editAdmin['updatedAt'] = Date.now()

        const newAdmin = await Admin.findByIdAndUpdate(id, editAdmin, {new: true})
                                        .catch( error => {return response.status(500).json({code: 500, msg: 'created error', detail: error.message})})

        const token = jwt.sign(
            {newAdmin},
            process.env.SECRET,
            {
                expiresIn: 60 * 60 * 24
            }
        )
        
        response.cookie('token', token, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    
        response.status(200).json({code: 200,
                                   msg: 'the administrator has been updated successfully',
                                   data: {admin: newAdmin, token: token} })

        if(audits){
           for(let i=0; i < audits.length; i++){
                for(let j=0; j < audits[i].dealerships.length; j++){
                    for(let k=0; k < audits[i].dealerships[j].installations.length; k++){
                        const auditInstFind = await AuditInstallation.findOne({installation_id: audits[i].dealerships[j].installations[k], audit_id: audits[i].audit})
                        const existAuditor = auditInstFind?.auditor_id?.includes(id)
                        if(auditInstFind && !existAuditor){
                            await AuditInstallation.findByIdAndUpdate(auditInstFind._id, {$push: {auditor_id: id}})
                        }
                    }
                }
           }
        }
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }          
}

const deleteAdmin = async(request, response) => {
    try{
        const {id} = request.params
        const adminRole = request.jwt.admin.role

        if(adminRole !== 'main'){
            return response.status(401).json({code: 401,
                msg: 'invalid credentials',
                detail: 'you do not have permissions'})
        }

        //Validations
        if(!id)
            return response.status(400).json({code: 400,
                                            msg: 'invalid id',
                                            detail: 'id is a obligatory field'})

        if(id && !ObjectId.isValid(id))
            return response.status(400).json({code: 400,
                                            msg: 'invalid id',
                                            detail: 'id should be an objectId'})

        admin = await Admin.findById(id)
        if (!admin)
            return response.status(404).json({code: 404,
                                                msg: 'invalid id',
                                                detail: 'id not found'})

        await Admin.findByIdAndDelete(id)
                        .catch( error => {return response.status(500).json({code: 500, msg: 'deleted error', detail: error.message})})

        response.status(200).json({code: 200,
                                   msg: 'the administrator has been deleted successfully',
                                   data: admin })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getAllAdmins = async(request, response) => {
    try{
        const {names, surnames, emailAddress, userName, role, dealership, pageReq} = request.body
        const adminRole = request.jwt.admin.role

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        const filter = {}

        if(names)
            filter['names'] = new RegExp((names).toLowerCase())
            
        if(surnames)
            filter['surnames'] = new RegExp((surnames).toLowerCase())

        if(emailAddress)
            filter['emailAddress'] = new RegExp((emailAddress).toLowerCase())
            
        if(userName)
            filter['userName'] = new RegExp((userName).toLowerCase())

        if( role || adminRole === 'admin'){
            if(adminRole !== 'admin' || (adminRole === 'admin' && (role === 'dealership' || role === 'auditor'))){
                filter['role'] = new RegExp((role).toLowerCase())
            }
            else{
                filter['role'] = new RegExp(/auditor|dealership/)
            }
        }

        if(dealership)
            filter['dealership'] = new RegExp((dealership).toLowerCase())

        if(page === 0){
            const admins = await Admin.find(filter).populate('dealership')
            
            const data = {admins: admins, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await Admin.countDocuments(filter)

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400, 
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})

        const admins = await Admin.find(filter).populate('dealership').skip(skip).limit(10)
        
        const data = {admins: admins, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getAdmin = async(request, response) => {

    const {id} = request.params
    const { role, _id } = request.jwt.admin

    if(!id)
        return response.status(400).json({code: 400,
                                            msg: 'invalid id',
                                            detail: 'id is a obligatory field'})

    if(id && !ObjectId.isValid(id))
        return response.status(400).json({code: 400,
                                          msg: 'invalid id',
                                          detail: 'id should be an objectId'})

    const admin = await Admin.findById(id)

    if(role !== 'main' && admin.id.toString() !== _id.toString() && admin.role !== 'dealership' && admin.role !== 'auditor'){
        return response.status(401).json({code: 401,
            msg: 'invalid credentials',
            detail: 'you do not have permissions'})
    }

    else if(admin){
        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: admin})
    }
    else{
        response.status(200).json({code: 204,
                                    msg: 'not found',
                                    data: null})}
}

module.exports = {createAdmin, updateAdmin, deleteAdmin, getAllAdmins, getAdmin, loginAdmin}
