const express = require('express')
const apiProvider = express.Router()
const Provider = require('../../controllers/provider/provider_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiProvider.post('/', authenticationAdmin.validate, Provider.createProvider)
apiProvider.post('/all', authenticationAdmin.validate, Provider.getAllProvider)
apiProvider.put('/:id', authenticationAdmin.validate, Provider.updateProvider)
apiProvider.delete('/:id', authenticationAdmin.validate, Provider.deleteProvider)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiProvider
