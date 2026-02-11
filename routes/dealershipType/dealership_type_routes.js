const express = require('express')
const apiDealershipType = express.Router()
const DealershipType = require('../../controllers/dealershipType/dealership_type_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiDealershipType.get('/:id', authenticationAdmin.validate, DealershipType.getDealership)
apiDealershipType.get('/', authenticationAdmin.validate, DealershipType.getAllDealerships)
module.exports = apiDealershipType
