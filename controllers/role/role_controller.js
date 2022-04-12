const RoleType = require("../../models/role_model")
const ObjectId = require('mongodb').ObjectId

const createRole = async(request, response) => {
    try{
        const {name, requirements, weight, total_required} = request.body
        let errors = []

        if(!name || name.length < 1)
            errors.push({code: 400, 
                        msg: 'invalid name',
                        detail: `name is required`
                        })      
        else if(name){
            const existName = await RoleType.exists({name: { $regex : new RegExp(name, "i") } })
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
            if(existName)
                errors.push({code: 404, 
                                msg: 'invalid name',
                                detail: `${name} already exist`
                            })
        }

        if(weight && typeof weight !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid weight',
                            detail: `weight is required, and should be a number type`
                        })

        if(total_required && typeof total_required !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid total_required',
                            detail: `total_required is required, and should be a number type`
                        })

        if(requirements && !Array.isArray(requirements))
            errors.push({code: 400, 
                        msg: 'invalid requirements',
                        detail: `requirements is required, and should be a number type`
                    })

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const newRol = new RoleType({
            name: name,
            requirements: requirements? requirements: null,
            total_required: total_required? total_required: null,
            weight: weight? weight: null
        })

        await newRol.save()
                    .catch(error => {        
                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                    })

        response.status(201).json({code: 201,
                                    msg: 'the newRol has been created successfully',
                                    data: newRol })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateRole = async(request, response) => {
    try{
        const {id} = request.params
        const {name, requirements, weight, total_required} = request.body

        let errors = []

        if(id && ObjectId.isValid(id)){
            const existId = await RoleType.findById(id)
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
        
        if(name && name.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name',
                            detail: `invalid name format`
                        })
        else if(name){
            const nameExist = await RoleType.exists({name: { $regex : new RegExp(name, "i") }})
            if(nameExist){
                errors.push({code: 400, 
                    msg: 'invalid name',
                    detail: `name already exist`
                })
            }
        }

        if((requirements && requirements.length < 1) || (requirements && !Array.isArray(requirements))){
            errors.push({code: 400, 
                        msg: 'invalid requirements',
                        detail: `invalid requirements format`
                        })
        }

        if(weight && typeof weight !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid weight',
                            detail: `invalid weight format`
                        })

        if(total_required && typeof total_required !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid total_required',
                            detail: `invalid total_required format`
                        })

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}

        if(name)
            updatedFields['name'] = name
        if(requirements)
            updatedFields['requirements'] = requirements
        if(weight)
            updatedFields['weight'] = weight
        if(total_required)
            updatedFields['total_required'] = total_required
        updatedFields['updatedAt'] = Date.now()

        const updatedRol = await RoleType.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        response.status(201).json({code: 200,
                                    msg: 'the Rol has been updated successfully',
                                    data: updatedRol })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllRoles = async(request, response) => {
    try{
        const {name, weight, total_required, pageReq } = request.body

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        const filter = {}

        if(name)
            filter['name'] = { $regex : new RegExp(name, "i") }

        if(weight)
            filter['weight'] = weight

        if(total_required)
            filter['total_required'] = total_required

        if(page === 0){
            const roles = await RoleType.find(filter)
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {roles: roles, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await RoleType.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if(countPage < page)
            return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

        const roles = await RoleType.find(filter).skip(skip).limit(10)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        const data = {roles: roles, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getRole = async(request, response) => {

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
    
        const roleType = await RoleType.findById(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
    
        if(roleType){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: roleType})
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

const deleteRole = async(request, response) => {
    try{
        const {id} = request.params

        if(id && ObjectId.isValid(id)){
            const existId = await RoleType.exists({_id: id})
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

        const deleteRole = await RoleType.findByIdAndDelete(id)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })

        response.status(200).json({code: 200,
                                    msg: 'the Role has been deleted successfully',
                                    data: deleteRole })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

module.exports = {getAllRoles, createRole, getRole, updateRole, deleteRole}
