const Installation = require("../../models/installation_schema")
const Personal = require("../../models/personal_model")
const InstallationType = require("../../models/installationType_model")
const Dealership = require("../../models/dealership_model")
var ObjectId = require('mongodb').ObjectId

const getAllInstallation = async(request, response) => {
    try{
        const {name, code, dealership, installation_type, phone, province, country, email, pageReq} = request.body

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        const filter = {}

        if(name)
            filter['name'] = { $regex : new RegExp(name, "i") } 
        if(code)
            filter['code'] = { $regex : new RegExp(code, "i") } 
        if(province)
            filter['province'] = { $regex : new RegExp(province, "i") } 
        if(country)
            filter['country'] = { $regex : new RegExp(country, "i") } 
        if(phone)
            filter['phone'] = { $regex : new RegExp(phone, "i") } 
        if(email)
            filter['email'] = { $regex : new RegExp(email, "i") } 
        if(installation_type)
            filter['installation_type'] = installation_type
        if(dealership)
            filter['dealership'] = dealership
        if(page === 0){
            const installations = await Installation.find(filter).populate({path: 'dealership installation_type'})
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {installations: installations, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await Installation.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if((countPage < page) && page !==1)
            return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

        const installations = await Installation.find(filter).skip(skip).limit(10).populate({path: 'dealership installation_type'})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        const data = {installations: installations, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const createInstallation = async(request, response) => {
    try{
        const {name, autonomous_community, code, address, dealership, installation_type, population, postal_code, phone, active, province, email,
               latitude, length, isSale, isPostSale, isHP, m2Exp, m2PostSale, m2Rec, contacts } = request.body

        let errors = []

        if(contacts && Array.isArray(contacts)){
            for(let i = 0; i<contacts.length; i++){
                const existContact = await Personal.findById(contacts[i])
                                                   .catch(error => {        
                                                      return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                   })
                if(!existContact){
                    return response.status(400).json({errors: [{code: 400, msg: 'invalid contacts', detail: 'invalid contacts'}]})
                }
            }
            
        }

        if(!name && name.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name',
                            detail: `name is required`
                        })
        else if(name){
            const existName = await Installation.exists({name: { $regex : new RegExp(name, "i") }})
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existName)
                errors.push({code: 400, 
                             msg: 'invalid name',
                             detail: `${name} is already in use`
                            })
        }

        if(!autonomous_community && autonomous_community.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid autonomous_community',
                            detail: `autonomous_community is required`
                        })

        if(!code && code.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid code',
                            detail: `code is required`
                        })
        else if(code){
            const existCode = await Installation.exists({code: { $regex : new RegExp(code, "i") }})
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existCode)
                errors.push({code: 400, 
                             msg: 'invalid code',
                             detail: `${code} is already in use`
                            })
        }

        if(!installation_type || (installation_type.length < 1 || (installation_type && !ObjectId.isValid(installation_type))))
            errors.push({code: 400, 
                        msg: 'invalid installation_type',
                        detail: `installation_type is required, and should be a ObjectID format`
                        })      
        else if(installation_type){
            const existInstallation_type = await InstallationType.findById(installation_type)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
            if(!existInstallation_type)
                errors.push({code: 404, 
                                msg: 'invalid installation_type',
                                detail: `${installation_type} not found`
                            })
        }

        if(!dealership || (dealership.length < 1 || (dealership && !ObjectId.isValid(dealership))))
            errors.push({code: 400, 
                        msg: 'invalid dealership',
                        detail: `dealership is required, and should be a ObjectID format`
                        })      
        else if(dealership){
            const existDealership = await Dealership.findById(dealership)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
            if(!existDealership)
                errors.push({code: 404, 
                                msg: 'invalid dealership',
                                detail: `${dealership} not found`
                            })
        }

        if(address && address.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid address',
                            detail: `address is required`
                        })

        if(population && population.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid population',
                            detail: `population is required`
                        })

        if(postal_code && postal_code.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid postal_code',
                            detail: `postal_code is required`
                        })

        if(phone && phone.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid phone',
                            detail: `phone is required`
                        })

        if(active !== undefined && active !== null && (active !== true && active !== false))
                    errors.push({code: 400, 
                                    msg: 'invalid active',
                                    detail: `invalid format`
                                })
            
        if(!province && province.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid province',
                            detail: `province is required`
                        })
   
        if(email && email.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid email',
                            detail: `email is required`
                        })
            
        if(latitude && latitude.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid latitude',
                            detail: `latitude is required`
                        })
            
        if(length && typeof length !== "number")
            errors.push({code: 400, 
                            msg: 'invalid length',
                            detail: `length should be a number`
                        })

        if(isSale !== undefined && isSale !== null && (isSale !== true && isSale !== false))
            errors.push({code: 400, 
                            msg: 'invalid isSale',
                            detail: `invalid format`
                        })

        if(isPostSale !== undefined && isPostSale !== null && (isPostSale !== true && isPostSale !== false))
            errors.push({code: 400, 
                            msg: 'invalid isPostSale',
                            detail: `invalid format`
                        })

        if(isHP !== undefined && isHP !== null && (isHP !== true && isHP !== false))
            errors.push({code: 400, 
                            msg: 'invalid isHP',
                            detail: `invalid format`
                        })

        if(m2Exp && typeof m2Exp !== "number")
            errors.push({code: 400, 
                            msg: 'invalid m2Exp',
                            detail: `invalid format`
                        })

        if(m2PostSale && typeof m2PostSale !== "number")
            errors.push({code: 400, 
                            msg: 'invalid m2PostSale',
                            detail: `invalid format`
                        })                                                                                            

        if(m2Rec && typeof m2Rec !== "number")
            errors.push({code: 400, 
                            msg: 'invalid m2Rec',
                            detail: `invalid format`
                        })     
                        
        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const newInstallation = new Installation({
            name, 
            autonomous_community, 
            code, 
            address, 
            dealership, 
            installation_type, 
            population, 
            postal_code, 
            phone, 
            active, 
            province, email,
            latitude, 
            length, 
            isSale, 
            isPostSale, 
            isHP, 
            m2Exp, 
            m2PostSale, 
            m2Rec,
            contacts
        })

        await newInstallation.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })

        await Dealership.findByIdAndUpdate(dealership, {$push: { installations: newInstallation._id }})

        response.status(201).json({code: 201,
                                    msg: 'the newInstallation has been created successfully',
                                    data: newInstallation })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getInstallation = async(request, response) => {

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
    
        const instType = await Installation.findById(id).populate({path: 'dealership installation_type'})
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

const updateInstallation = async(request, response) => {
    try{
        const {name, autonomous_community, code, address, dealership, installation_type, population, postal_code, phone, active, province, email,
               latitude, length, isSale, isPostSale, isHP, m2Exp, m2PostSale, m2Rec, contacts } = request.body

        let errors = []

        if(contacts && Array.isArray(contacts)){
            for(let i = 0; i<contacts.length; i++){
                const existContact = await Personal.findById(contacts[i])
                                                   .catch(error => {        
                                                      return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                   })
                if(!existContact){
                    return response.status(400).json({errors: [{code: 400, msg: 'invalid contacts', detail: 'invalid contacts'}]})
                }
            }
            
        }

        if(name && name.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name',
                            detail: `name is required`
                        })
        else if(name){
            const existName = await Installation.exists({name: { $regex : new RegExp(name, "i") }})
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existName)
                errors.push({code: 400, 
                             msg: 'invalid name',
                             detail: `${name} is already in use`
                            })
        }

        if(autonomous_community && autonomous_community.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid autonomous_community',
                            detail: `autonomous_community is required`
                        })

        if(code && code.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid code',
                            detail: `code is required`
                        })
        else if(code){
            const existCode = await Installation.exists({code: { $regex : new RegExp(code, "i") }})
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existCode)
                errors.push({code: 400, 
                             msg: 'invalid code',
                             detail: `${code} is already in use`
                            })
        }

        if(installation_type && (installation_type.length < 1 || (installation_type && !ObjectId.isValid(installation_type))))
            errors.push({code: 400, 
                        msg: 'invalid installation_type',
                        detail: `installation_type is required, and should be a ObjectID format`
                        })      
        else if(installation_type){
            const existInstallation_type = await InstallationType.findById(installation_type)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
            if(!existInstallation_type)
                errors.push({code: 404, 
                                msg: 'invalid installation_type',
                                detail: `${installation_type} not found`
                            })
        }

        if(dealership && (dealership.length < 1 || (dealership && !ObjectId.isValid(dealership))))
            errors.push({code: 400, 
                        msg: 'invalid dealership',
                        detail: `dealership is required, and should be a ObjectID format`
                        })      
        else if(dealership){
            const existDealership = await Dealership.findById(dealership)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
            if(!existDealership)
                errors.push({code: 404, 
                                msg: 'invalid dealership',
                                detail: `${dealership} not found`
                            })
        }

        if(address && address.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid address',
                            detail: `address is required`
                        })

        if(population && population.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid population',
                            detail: `population is required`
                        })

        if(postal_code && postal_code.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid postal_code',
                            detail: `postal_code is required`
                        })

        if(phone && phone.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid phone',
                            detail: `phone is required`
                        })

        if(active !== undefined && active !== null && (active !== true && active !== false))
                    errors.push({code: 400, 
                                    msg: 'invalid active',
                                    detail: `invalid format`
                                })
            
        if(province && province.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid province',
                            detail: `province is required`
                        })
   
        if(email && email.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid email',
                            detail: `email is required`
                        })
            
        if(latitude && latitude.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid latitude',
                            detail: `latitude is required`
                        })
            
        if(length && typeof length !== "number")
            errors.push({code: 400, 
                            msg: 'invalid length',
                            detail: `length is required`
                        })

        if(isSale !== undefined && isSale !== null && (isSale !== true && isSale !== false))
            errors.push({code: 400, 
                            msg: 'invalid isSale',
                            detail: `invalid format`
                        })

        if(isPostSale !== undefined && isPostSale !== null && (isPostSale !== true && isPostSale !== false))
            errors.push({code: 400, 
                            msg: 'invalid isPostSale',
                            detail: `invalid format`
                        })

        if(isHP !== undefined && isHP !== null && (isHP !== true && isHP !== false))
            errors.push({code: 400, 
                            msg: 'invalid isHP',
                            detail: `invalid format`
                        })

        if(m2Exp && typeof m2Exp !== "number")
            errors.push({code: 400, 
                            msg: 'invalid m2Exp',
                            detail: `invalid format`
                        })

        if(m2PostSale && typeof m2PostSale !== "number")
            errors.push({code: 400, 
                            msg: 'invalid m2PostSale',
                            detail: `invalid format`
                        })                                                                                            

        if(m2Rec && typeof m2Rec !== "number")
            errors.push({code: 400, 
                            msg: 'invalid m2Rec',
                            detail: `invalid format`
                        })     
                        
        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}

        if(name)
            updatedFields['name'] = name
        if(autonomous_community)
            updatedFields['autonomous_community'] = autonomous_community
        if(code)
            updatedFields['code'] = code
        if(dealership)
            updatedFields['dealership'] = dealership
        if(address)
            updatedFields['address'] = address
        if(installation_type)
            updatedFields['installation_type'] = installation_type
        if(population)
            updatedFields['population'] = population
        if(postal_code)
            updatedFields['postal_code'] = postal_code
        if(phone)
            updatedFields['phone'] = phone
        if(active!==undefined && active !== null && (active === true || active ===false))
            updatedFields['active'] = active
        if(province)
            updatedFields['province'] = province
        if(email)
            updatedFields['email'] = email
        if(latitude)
            updatedFields['latitude'] = latitude
        if(length)
            updatedFields['length'] = length
        if(isSale!==undefined && isSale !== null && (isSale === true || isSale ===false))
            updatedFields['isSale'] = isSale
        if(isPostSale!==undefined && isPostSale !== null && (isPostSale === true || isPostSale ===false))
            updatedFields['isSale'] = isSale
        if(isHP!==undefined && isHP !== null && (isHP === true || isHP ===false))
            updatedFields['isHP'] = isHP
        if(m2Exp)
            updatedFields['m2Exp'] = m2Exp
        if(m2PostSale)
            updatedFields['m2PostSale'] = m2PostSale
        if(m2Rec)
            updatedFields['m2Rec'] = m2Rec
        if(contacts)
            updatedFields['contacts'] = contacts
        updatedFields['updatedAt'] = Date.now()

        const updatedInstallation = await Installation.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        response.status(201).json({code: 200,
                                    msg: 'the Installation has been updated successfully',
                                    data: updatedInstallation })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteInstallation = async(request, response) => {
    try{
        const {id} = request.params

        if(id && ObjectId.isValid(id)){
            const existId = await Installation.exists({_id: id})
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

        const deletedInstallation = await Installation.findByIdAndDelete(id)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })
        
        await Dealership.findByIdAndUpdate(deletedInstallation.dealership, {$pull: { installations: id }})
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })
        
        response.status(201).json({code: 201,
                                    msg: 'the Installation has been deleted successfully',
                                    data: deletedInstallation })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

module.exports = {getAllInstallation, createInstallation, getInstallation, updateInstallation, deleteInstallation}
