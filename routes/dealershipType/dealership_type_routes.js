const express = require('express')
const apiDealershipType = express.Router()
const DealershipType = require('../../controllers/dealershipType/dealership_type_controller')

apiDealershipType.get('/:id', DealershipType.getDealership)
apiDealershipType.get('/', DealershipType.getAllDealerships)
module.exports = apiDealershipType
