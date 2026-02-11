const express = require('express')
const api = express.Router()
const SizingTable = require('../../controllers/sizingTable/sizingTable_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

api.post('/all', authenticationAdmin.validate, SizingTable.getAllSizingTable)
api.post('/', authenticationAdmin.validate, SizingTable.createSizingTable)
api.put('/:id', authenticationAdmin.validate, SizingTable.updateSizingTable)
api.get('/:id', authenticationAdmin.validate, SizingTable.getSizingTable)
api.delete('/:id', authenticationAdmin.validate, SizingTable.deleteSizingTable)

module.exports = api
