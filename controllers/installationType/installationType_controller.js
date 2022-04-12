const InstallationType = require('../../models/installationType_model')
const ObjectId = require('mongodb').ObjectId

const createInstallationType = async(request, response) => {
    try{
        const {idSecondary, name, code} = request.body

        let errors = []

        if(!idSecondary || idSecondary.length < 1)
            errors.push({code: 400, 
                        msg: 'invalid idSecondary',
                        detail: `idSecondary is required`
                        })      
        else if(idSecondary){
            const existIdSecondary = await InstallationType.exists({idSecondary: { $regex : new RegExp(idSecondary, "i") } })
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
            const existName = await InstallationType.exists({name: { $regex : new RegExp(name, "i") }})
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existName)
                errors.push({code: 400, 
                             msg: 'invalid name',
                             detail: `${name} is already in use`
                            })
        }

        if(!code || code.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid code',
                            detail: `code is required`
                        })
        else if(code){
            const existCode = await InstallationType.exists({code: { $regex : new RegExp(code, "i") }})
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existCode)
                errors.push({code: 400, 
                             msg: 'invalid code',
                             detail: `${code} is already in use`
                            })
        }

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const newInstallationType = new InstallationType({
            idSecondary: idSecondary,
            name: name,
            code: code
        })

        await newInstallationType.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })

        response.status(201).json({code: 201,
                                    msg: 'the InstallationType has been created successfully',
                                    data: newInstallationType })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateInstallationType = async(request, response) => {
    try{
        const {id} = request.params
        const {idSecondary, name, code} = request.body

        let errors = []

        if(id && ObjectId.isValid(id)){
            const existId = await InstallationType.exists({_id: id})
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
                const existIdSecondary = await InstallationType.findOne({idSecondary: { $regex : new RegExp(idSecondary, "i") }})
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
                const existName = await InstallationType.findOne({name: { $regex : new RegExp(name, "i") }})
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

        if(code){
            if(code.length < 1){
                errors.push({code: 400, 
                                msg: 'invalid code',
                                detail: `code is required`
                            })
            }
            else{
                const existCode = await InstallationType.findOne({code: { $regex : new RegExp(code, "i") }})
                .catch(error => {        
                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                })
                if(existCode && existCode._id.toString() !== id)
                    errors.push({code: 400, 
                                msg: 'invalid code',
                                detail: `${code} is already in use`
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
        if(code)
            updatedFields['code'] = code
        updatedFields['updatedAt'] = Date.now()

        const updatedInstallationType = await InstallationType.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        response.status(201).json({code: 200,
                                    msg: 'the InstallationType has been updated successfully',
                                    data: updatedInstallationType })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteInstallationType = async(request, response) => {
    try{
        const {id} = request.params

        if(id && ObjectId.isValid(id)){
            const existId = await InstallationType.exists({_id: id})
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

        const deletedInstallationType = await InstallationType.findByIdAndDelete(id)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
        response.status(201).json({code: 201,
                                    msg: 'the InstallationType has been deleted successfully',
                                    data: deletedInstallationType })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getAllInstallationType= async(request, response) => {
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
            const installationTypes = await InstallationType.find(filter)
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {installationTypes: installationTypes, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await InstallationType.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if(countPage < page)
            return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

        const installationTypes = await InstallationType.find(filter).skip(skip).limit(10)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        const data = {installationTypes: installationTypes, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const getInstallationType = async(request, response) => {

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
    
        const instType = await InstallationType.findById(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
    
        if(instType){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: instType})
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

module.exports = {createInstallationType, updateInstallationType, deleteInstallationType, getAllInstallationType, getInstallationType}