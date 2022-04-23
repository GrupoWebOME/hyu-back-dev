const express = require('express')
const api = express.Router()
const SizingTable = require('../../controllers/sizingTable/sizingTable_controller')

api.post('/all', SizingTable.getAllSizingTable)
api.post('/', SizingTable.createSizingTable)
api.put('/:id', SizingTable.updateSizingTable)
api.get('/:id', SizingTable.getSizingTable)
api.delete('/:id', SizingTable.deleteSizingTable)

module.exports = api
