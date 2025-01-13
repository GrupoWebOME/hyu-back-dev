const DealershipTypeModel = require('../../models/dealership_type_model')
const ObjectId = require('mongodb').ObjectId

const getDealership = async(request, response) => {
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
    
    const dealershipsType = await DealershipTypeModel.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(dealershipsType){
      response.status(200).json({code: 200,
        msg: 'success',
        data: dealershipsType})
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

const getAllDealerships = async(_request, response) => {
  try{
    const dealershipsTypes = await DealershipTypeModel.find()
    return response.status(200).json({code: 200,
      msg: 'success',
      data: dealershipsTypes })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
}

module.exports = { getDealership, getAllDealerships }
