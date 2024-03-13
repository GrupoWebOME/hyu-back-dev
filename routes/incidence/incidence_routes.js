const express = require('express')
const apiIncidence = express.Router()
const Incidence = require('../../controllers/incidence/incidence_controller')

apiIncidence.post('/', Incidence.createIncidence)
apiIncidence.post('/all', Incidence.getAllIncidences)
apiIncidence.put('/:id', Incidence.updateIncidence)
apiIncidence.delete('/:id', Incidence.deleteIncidence)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiIncidence
