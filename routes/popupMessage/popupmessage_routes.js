const express = require('express')
const apiPopupMessage = express.Router()
const PopUpMessage = require('../../controllers/popupMessage/popupmessage_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiPopupMessage.post('/', authenticationAdmin.validate, PopUpMessage.createPopUp)
apiPopupMessage.post('/all', authenticationAdmin.validate, PopUpMessage.getAllPopUp)
apiPopupMessage.put('/:id', authenticationAdmin.validate, PopUpMessage.updatePopUp)
apiPopupMessage.get('/:id', authenticationAdmin.validate, PopUpMessage.getPopUp)
apiPopupMessage.delete('/:id', authenticationAdmin.validate, PopUpMessage.deletePopUp)

module.exports = apiPopupMessage
