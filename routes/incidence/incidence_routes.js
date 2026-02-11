const express = require('express')
const apiIncidence = express.Router()
const Incidence = require('../../controllers/incidence/incidence_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiIncidence.post('/', authenticationAdmin.validate, Incidence.createIncidence)
apiIncidence.post('/all', authenticationAdmin.validate, Incidence.getAllIncidences)
apiIncidence.put('/:id', authenticationAdmin.validate, Incidence.updateIncidence)
apiIncidence.delete('/:id', authenticationAdmin.validate, Incidence.deleteIncidence)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiIncidence
