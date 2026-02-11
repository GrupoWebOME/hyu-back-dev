const express = require('express')
const apiIncidenceType = express.Router()
const IncidenceType = require('../../controllers/incidenceType/incidence_type_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiIncidenceType.post('/', authenticationAdmin.validate, IncidenceType.createIncidenceType)
apiIncidenceType.post('/all', authenticationAdmin.validate, IncidenceType.getAllIncidencesTypes)
apiIncidenceType.put('/:id', authenticationAdmin.validate, IncidenceType.updateIncidenceType)
apiIncidenceType.delete('/:id', authenticationAdmin.validate, IncidenceType.deleteIncidenceType)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiIncidenceType
