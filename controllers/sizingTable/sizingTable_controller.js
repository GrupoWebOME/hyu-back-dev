const SizingTable = require("../../models/sizingTable_model")
const ObjectId = require('mongodb').ObjectId

const createSizingTable = async(request, response) => {
    try{
        const {name, columns, rows, row} = request.body

        let errors = []

        if(!name || name.length < 1)
            errors.push({code: 400, 
                        msg: 'invalid name',
                        detail: `name is required`
                        })      

        if(!columns || (columns && (columns.length <= 0 || !Array.isArray(columns))))
            errors.push({code: 400, 
                        msg: 'invalid columns',
                        detail: `columns should be an array type, and is required`
                        })   
        
        else if(columns){
            for(let i = 0; i < columns.length; i++){
                if( !columns[i].hasOwnProperty("name") || !columns[i].hasOwnProperty("level2") || !Array.isArray(columns[i].level2) || columns[i].level2.length <= 0)
                    errors.push({code: 400, 
                        msg: 'invalid column',
                        detail: `name and level2 are obligatories fields, level2 should be in array format`
                        }) 
                for(let j = 0; j < columns[i].level2.length; j++){            
                    if(!columns[i].level2[j].hasOwnProperty("name") || !columns[i].level2[j].hasOwnProperty("level3") || !Array.isArray(columns[i].level2[j].level3) || columns[i].level2[j].level3.length <= 0)
                        errors.push({code: 400, 
                            msg: 'invalid level2',
                            detail: `name and level3 are obligatories fields, level3 should be in array format`
                            })
                    for(let z = 0; z < columns[i].level2[j].level3.length; z++){            
                        if(!columns[i].level2[j].level3[z].hasOwnProperty("name"))
                            errors.push({code: 400, 
                                msg: 'invalid level3',
                                detail: `name, model and field are obligatory fields`
                                })
                    }
                }
            }
        }

        if(!rows || (rows && (rows.length <= 0 || !Array.isArray(rows))))
            errors.push({code: 400, 
                        msg: 'invalid rows',
                        detail: `rows should be an array type, and is required`
                        })   

        else if(rows){
            for(let i = 0; i < rows.length; i++){

                if(!rows[i].hasOwnProperty("name") || !rows[i].hasOwnProperty("initialValue") || !rows[i].hasOwnProperty("endValue") || !rows[i].hasOwnProperty("values"))
                    errors.push({code: 400, 
                        msg: 'invalid rows',
                        detail: `name, initialValue, endValue and values are obligatories fields`
                        })   

                if(isNaN(rows[i].initialValue) || isNaN(rows[i].endValue))
                    errors.push({code: 400, 
                        msg: 'invalid initialValue or endValue format',
                        detail: `initialValue or endValue should be a number format`
                        })   

                if(rows[i].initialValue > rows[i].endValue)
                    errors.push({code: 400, 
                        msg: 'invalid initialValue and endValue values',
                        detail: `initialValue should be <= endValue`
                        })  

                if(!Array.isArray(rows[i].values))
                    errors.push({code: 400, 
                        msg: 'invalid values format',
                        detail: `values should be an array format`
                        })   
                
                for(let j = 0; j < rows[i].values.length; j++){
                    if(isNaN(rows[i].values[j]))
                        errors.push({code: 400, 
                            msg: 'invalid values format',
                            detail: `values element should be a number format`
                            })   
                }
            }
        }

        if(!row)
            errors.push({code: 400, 
                msg: 'invalid row',
                detail: `row is required`
                })   

        else if(!row.hasOwnProperty("model") || !row.hasOwnProperty("field"))
            errors.push({code: 400, 
                msg: 'invalid row',
                detail: `model, field and values are obligatories fields`
                })   

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const newSizingTable = new SizingTable({
            name: name,
            columns: columns,
            rows: rows,
            row: row
        })

        await newSizingTable.save()
                    .catch(error => {        
                        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                    })

        response.status(201).json({code: 201,
                                    msg: 'the newSizingTable has been created successfully',
                                    data: newSizingTable })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const updateSizingTable = async(request, response) => {
    try{
        const {id} = request.params
        const {name, columns, rows, row} = request.body

        let errors = []

        if(id && ObjectId.isValid(id)){
            sizingTableById = await SizingTable.findById(id)
                                .catch(error => {return response.status(400).json({code: 500, 
                                                                                    msg: 'error id',
                                                                                    detail: error.message
                                                                                })} )  
            if(!sizingTableById)
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

        if(!name || name.length < 1)
            errors.push({code: 400, 
                        msg: 'invalid name',
                        detail: `name is required`
                        })      

        if(columns){
            for(let i = 0; i < columns.length; i++){
                if( !columns[i].hasOwnProperty("name") || !columns[i].hasOwnProperty("level2") || !Array.isArray(columns[i].level2) || columns[i].level2.length <= 0)
                    errors.push({code: 400, 
                        msg: 'invalid column',
                        detail: `name and level2 are obligatories fields, level2 should be in array format`
                        }) 
                for(let j = 0; j < columns[i].level2.length; j++){            
                    if(!columns[i].level2[j].hasOwnProperty("name") || !columns[i].level2[j].hasOwnProperty("level3") || !Array.isArray(columns[i].level2[j].level3) || columns[i].level2[j].level3.length <= 0)
                        errors.push({code: 400, 
                            msg: 'invalid level2',
                            detail: `name and level3 are obligatories fields, level3 should be in array format`
                            })
                    for(let z = 0; z < columns[i].level2[j].level3.length; z++){            
                        if(!columns[i].level2[j].level3[z].hasOwnProperty("name"))
                            errors.push({code: 400, 
                                msg: 'invalid level3',
                                detail: `name, model and field are obligatory fields`
                                })
                    }
                }
            }
        }

        if(rows){
            for(let i = 0; i < rows.length; i++){

                if(!rows[i].hasOwnProperty("name") || !rows[i].hasOwnProperty("initialValue") || !rows[i].hasOwnProperty("endValue") || !rows[i].hasOwnProperty("values"))
                    errors.push({code: 400, 
                        msg: 'invalid rows',
                        detail: `name, initialValue, endValue and values are obligatories fields`
                        })   

                if(isNaN(rows[i].initialValue) || isNaN(rows[i].endValue))
                    errors.push({code: 400, 
                        msg: 'invalid initialValue or endValue format',
                        detail: `initialValue or endValue should be a number format`
                        })   

                if(rows[i].initialValue > rows[i].endValue)
                    errors.push({code: 400, 
                        msg: 'invalid initialValue and endValue values',
                        detail: `initialValue should be <= endValue`
                        })  

                if(!Array.isArray(rows[i].values))
                    errors.push({code: 400, 
                        msg: 'invalid values format',
                        detail: `values should be an array format`
                        })   
                
                for(let j = 0; j < rows[i].values.length; j++){
                    if(isNaN(rows[i].values[j]))
                        errors.push({code: 400, 
                            msg: 'invalid values format',
                            detail: `values element should be a number format`
                            })   
                }
            }
        }

        if(row && (!row.hasOwnProperty("model") || !row.hasOwnProperty("field")))
            errors.push({code: 400, 
                msg: 'invalid row',
                detail: `model, field and values are obligatories fields`
                })   

        if(errors.length > 0)
            return response.status(400).json({errors: errors})

        const updatedFields = {}

        if(name)
            updatedFields['name'] = name
        if(columns)
            updatedFields['columns'] = columns
        if(rows)
            updatedFields['rows'] = rows
        if(row)
            updatedFields['row'] = row
        updatedFields['updatedAt'] = Date.now()

        const updatedSizingTable = await SizingTable.findByIdAndUpdate(id, updatedFields, {new: true})
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        response.status(201).json({code: 200,
                                    msg: 'the SizingTable has been updated successfully',
                                    data: updatedSizingTable })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const deleteSizingTable = async(request, response) => {
    try{
        const {id} = request.params

        if(id && ObjectId.isValid(id)){
            const existId = await SizingTable.exists({_id: id})
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

        const deleteSizingTable = await SizingTable.findByIdAndDelete(id)
                                                .catch(error => {        
                                                    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                                })

        response.status(200).json({code: 200,
                                    msg: 'the SizingTable has been deleted successfully',
                                    data: deleteSizingTable })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

const getSizingTable= async(request, response) => {

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
    
        const sizingTable = await SizingTable.findById(id)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })
    
        if(sizingTable){
            response.status(200).json({code: 200,
                                       msg: 'success',
                                       data: sizingTable})
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

const getAllSizingTable = async(request, response) => {
    try{
        const {pageReq } = request.body

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        if(page === 0){
            const sizingTables = await SizingTable.find()
                                             .catch(error => {        
                                                return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                             })
            const data = {sizingTables: sizingTables, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await SizingTable.countDocuments()
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if(countPage < page)
            return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

        const sizingTable = await SizingTable.find().skip(skip).limit(10)
                                        .catch(error => {        
                                            return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
                                        })

        const data = {sizingTable: sizingTable, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

module.exports = {createSizingTable, updateSizingTable, deleteSizingTable, getSizingTable, getAllSizingTable}
