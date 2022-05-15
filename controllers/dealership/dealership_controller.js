const Dealership = require('../../models/dealership_model')
const Installation = require('../../models/installation_schema')
const ObjectId = require('mongodb').ObjectId

const getAllDealership= async(request, response) => {
    try{
        const {name, address, province, pageReq} = request.body

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        const filter = {}

        if(name)
            filter['name'] = { $regex : new RegExp(name, "i") }

        if(address)
            filter['address'] = { $regex : new RegExp(address, "i") }

        if(province)
            filter['province'] = { $regex : new RegExp(province, "i") }

        if(page === 0){
            const dealerships = await Dealership.find(filter)
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {dealerships: dealerships, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await Dealership.countDocuments(filter)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400, 
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})

        const dealerships = await Dealership.find(filter).skip(skip).limit(10)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        const data = {dealerships: dealerships, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const createDealership = async(request, response) => {
    try{
        const {name, cif, code, address, location, province, postal_code, autonomous_community, phone, email, name_surname_manager, previous_year_sales, referential_sales, 
            post_sale_spare_parts_previous_year, post_sale_referential_spare_parts, vn_quaterly_billing, electric_quaterly_billing, ionic5_quaterly_billing, post_sale_daily_income} = request.body

        let errors = []

        if(!name || name.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name',
                            detail: `name is required`
                        })
        else if(name){
            const existName = await Dealership.exists({name: { $regex : new RegExp(name, "i") }})
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
        
        if(address && address.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid address',
                            detail: `invalid address`
                        })

        if(cif && cif.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid cif',
                            detail: `invalid cif`
                        })
        
        if(autonomous_community && autonomous_community.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid autonomous_community',
                            detail: `invalid autonomous_community`
                        })

        if(!location || location.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid location',
                            detail: `location is required`
                        })
                        
        if(!province || province.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid province',
                            detail: `province is required`
                        })
                        
        if(!postal_code || postal_code.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid postal_code',
                            detail: `postal_code is required`
                        })

        if(!phone || phone.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid phone',
                            detail: `phone is required`
                        })
                        
        if(!email || email.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid email',
                            detail: `email is required`
                        })
                        
        if(!name_surname_manager || name_surname_manager.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name_surname_manager',
                            detail: `name_surname_manager is required`
                        })
                        
        if(previous_year_sales && typeof previous_year_sales !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid previous_year_sales',
                            detail: `previous_year_sales should be a number value`
                        })           
                        
        if(referential_sales && typeof referential_sales !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid referential_sales',
                            detail: `referential_sales should be a number value`
                        })   
        
        if(post_sale_spare_parts_previous_year && typeof post_sale_spare_parts_previous_year !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid post_sale_spare_parts_previous_year',
                            detail: `post_sale_spare_parts_previous_year should be a number value`
                        })   

        if(post_sale_referential_spare_parts && typeof post_sale_referential_spare_parts !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid post_sale_referential_spare_parts',
                            detail: `post_sale_referential_spare_parts should be a number value`
                        })   
                                                
        if(post_sale_daily_income && typeof post_sale_daily_income !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid post_sale_daily_income',
                            detail: `post_sale_daily_income should be a number value`
                        })           
                        
        if(vn_quaterly_billing && typeof vn_quaterly_billing !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid vn_quaterly_billing',
                            detail: `vn_quaterly_billing should be a number value`
                        })   
                        
        if(electric_quaterly_billing && typeof electric_quaterly_billing !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid electric_quaterly_billing',
                            detail: `electric_quaterly_billing should be a number value`
                        })           

        if(ionic5_quaterly_billing && typeof ionic5_quaterly_billing !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid ionic5_quaterly_billing',
                            detail: `ionic5_quaterly_billing should be a number value`
                        })   

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const newDealership = new Dealership({
            name, 
            cif,
            code, 
            address, 
            location, 
            province, 
            postal_code, 
            phone, 
            email, 
            autonomous_community,
            name_surname_manager, 
            previous_year_sales, 
            referential_sales, 
            post_sale_spare_parts_previous_year, 
            post_sale_referential_spare_parts, 
            vn_quaterly_billing, 
            electric_quaterly_billing, 
            ionic5_quaterly_billing, 
            post_sale_daily_income
        })

        await newDealership.save()
                        .catch(error => {        
                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                        })
        response.status(201).json({code: 201,
                                   msg: 'the Dealership has been created successfully',
                                   data: newDealership })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateDealership = async(request, response) => {
    try{
        const {name, cif, code, address, autonomous_community, location, province, postal_code, phone, email, name_surname_manager, previous_year_sales, referential_sales, 
            post_sale_spare_parts_previous_year, post_sale_referential_spare_parts, vn_quaterly_billing, electric_quaterly_billing, ionic5_quaterly_billing, post_sale_daily_income} = request.body
        const {id} = request.params

        let errors = []
        let dealerById = null

        if(id && ObjectId.isValid(id)){
            dealerById = await Dealership.findById(id)
                                          .catch(error => {return response.status(400).json({code: 500, 
                                                                                            msg: 'error id',
                                                                                            detail: error.message
                                                                                            })} )  
            if(!dealerById)
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

        if(name){
            if(name.length < 1)
                errors.push({code: 400, 
                    msg: 'invalid name',
                    detail: `name is empty`
                })
            const existName = await Dealership.exists({name: { $regex : new RegExp(name, "i") }})
                                            .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                            })
            if(existName && dealerById.name !== name)
                errors.push({code: 400, 
                             msg: 'invalid name',
                             detail: `${name} is already in use`
                            })
        }
        
        if(code){
            if(code.length < 1)
                errors.push({code: 400, 
                    msg: 'invalid code',
                    detail: `code is empty`
                })
        }

        if(address && address.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid address',
                            detail: `address is required`
                        })
        
        if(cif && cif.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid cif',
                            detail: `cif is required`
                        })
        
        if(autonomous_community && autonomous_community.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid autonomous_community',
                            detail: `invalid autonomous_community`
                        })

        if(location && location.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid location',
                            detail: `location is required`
                        })
                        
        if(province && province.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid province',
                            detail: `province is required`
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
                        
        if(email && email.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid email',
                            detail: `email is required`
                        })
                        
        if(name_surname_manager && name_surname_manager.length < 1)
            errors.push({code: 400, 
                            msg: 'invalid name_surname_manager',
                            detail: `name_surname_manager is required`
                        })
                        
        if(previous_year_sales && typeof previous_year_sales !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid previous_year_sales',
                            detail: `previous_year_sales should be a number value`
                        })           
                        
        if(referential_sales && typeof referential_sales !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid referential_sales',
                            detail: `referential_sales should be a number value`
                        })   
        
        if(post_sale_spare_parts_previous_year && typeof post_sale_spare_parts_previous_year !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid post_sale_spare_parts_previous_year',
                            detail: `post_sale_spare_parts_previous_year should be a number value`
                        })   

        if(post_sale_referential_spare_parts && typeof post_sale_referential_spare_parts !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid post_sale_referential_spare_parts',
                            detail: `post_sale_referential_spare_parts should be a number value`
                        })   
                        
        if(post_sale_daily_income && typeof post_sale_daily_income !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid post_sale_daily_income',
                            detail: `post_sale_daily_income should be a number value`
                        })            
                        
        if(vn_quaterly_billing && typeof vn_quaterly_billing !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid vn_quaterly_billing',
                            detail: `vn_quaterly_billing should be a number value`
                        })   
                        
        if(electric_quaterly_billing && typeof electric_quaterly_billing !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid electric_quaterly_billing',
                            detail: `electric_quaterly_billing should be a number value`
                        })           

        if(ionic5_quaterly_billing && typeof ionic5_quaterly_billing !== 'number')
            errors.push({code: 400, 
                            msg: 'invalid ionic5_quaterly_billing',
                            detail: `ionic5_quaterly_billing should be a number value`
                        })   

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}

        if(name)
            updatedFields['name'] = name
        if(cif)
            updatedFields['cif'] = cif
        if(address)
            updatedFields['address'] = address
        if(autonomous_community)
            updatedFields['autonomous_community'] = autonomous_community
        if(code)
            updatedFields['code'] = code
        if(location)
            updatedFields['location'] = location
        if(province)
            updatedFields['province'] = province
        if(postal_code)
            updatedFields['postal_code'] = postal_code
        if(phone)
            updatedFields['phone'] = phone
        if(email)
            updatedFields['email'] = email
        if(name_surname_manager)
            updatedFields['name_surname_manager'] = name_surname_manager
        if(previous_year_sales)
            updatedFields['previous_year_sales'] = previous_year_sales
        if(referential_sales)
            updatedFields['referential_sales'] = referential_sales
        if(post_sale_spare_parts_previous_year)
            updatedFields['post_sale_spare_parts_previous_year'] = post_sale_spare_parts_previous_year
        if(post_sale_referential_spare_parts)
            updatedFields['post_sale_referential_spare_parts'] = post_sale_referential_spare_parts
        if(vn_quaterly_billing)
            updatedFields['vn_quaterly_billing'] = vn_quaterly_billing
        if(electric_quaterly_billing)
            updatedFields['electric_quaterly_billing'] = electric_quaterly_billing
        if(ionic5_quaterly_billing)
            updatedFields['ionic5_quaterly_billing'] = ionic5_quaterly_billing
        if(post_sale_daily_income)
            updatedFields['post_sale_daily_income'] = post_sale_daily_income
        updatedFields['updatedAt'] = Date.now()

        const updatedDealership = await Dealership.findByIdAndUpdate(id, updatedFields, {new: true})
            .catch(error => {        
                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
            })

        response.status(201).json({code: 200,
            msg: 'the Dealership has been updated successfully',
            data: updatedDealership })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteDealership = async(request, response) => {
    try{
        const {id} = request.params

        if(id && ObjectId.isValid(id)){
            const existId = await Dealership.exists({_id: id})
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

        const deletedDealership = await Dealership.findByIdAndDelete(id)
                                                    .catch(error => {        
                                                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                    })
                            
        await Installation.deleteMany({dealership: id})
                            .catch(error => {        
                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                            })

        response.status(201).json({code: 201,
                                    msg: 'the Dealership has been deleted successfully',
                                    data: deletedDealership })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getDealership = async(request, response) => {
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
    
        const block = await Dealership.findById(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
    
        if(block){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: block})
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

module.exports = {getAllDealership, createDealership, updateDealership, deleteDealership, getDealership}
