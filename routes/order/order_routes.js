const express = require('express')
const apiOrder = express.Router()
const Order = require('../../controllers/order/order_controller')

apiOrder.post('/', Order.createOrder)
apiOrder.post('/all', Order.getAllOrders)
apiOrder.put('/:id', Order.updateOrder)
apiOrder.delete('/:id', Order.deleteOrder)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiOrder
