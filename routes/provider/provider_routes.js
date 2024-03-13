const express = require('express')
const apiProvider = express.Router()
const Provider = require('../../controllers/provider/provider_controller')

apiProvider.post('/', Provider.createProvider)
apiProvider.post('/all', Provider.getAllProvider)
apiProvider.put('/:id', Provider.updateProvider)
apiProvider.delete('/:id', Provider.deleteProvider)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiProvider
