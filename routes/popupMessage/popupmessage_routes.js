const express = require('express')
const apiPopupMessage = express.Router()
const PopUpMessage = require('../../controllers/popupMessage/popupmessage_controller')

apiPopupMessage.post('/', PopUpMessage.createPopUp)
apiPopupMessage.post('/all', PopUpMessage.getAllPopUp)
apiPopupMessage.put('/:id', PopUpMessage.updatePopUp)
apiPopupMessage.get('/:id', PopUpMessage.getPopUp)
apiPopupMessage.delete('/:id', PopUpMessage.deletePopUp)

module.exports = apiPopupMessage
