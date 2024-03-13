const express = require('express')
const apiIncidenceType = express.Router()
const IncidenceType = require('../../controllers/incidenceType/incidence_type_controller')

apiIncidenceType.post('/', IncidenceType.createIncidenceType)
apiIncidenceType.post('/all', IncidenceType.getAllIncidencesTypes)
apiIncidenceType.put('/:id', IncidenceType.updateIncidenceType)
apiIncidenceType.delete('/:id', IncidenceType.deleteIncidenceType)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiIncidenceType
