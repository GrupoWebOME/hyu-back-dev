const express = require('express')
const apiOrder = express.Router()
const Order = require('../../controllers/order/order_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiOrder.post('/', authenticationAdmin.validate, Order.createOrder)
apiOrder.post('/all', authenticationAdmin.validate, Order.getAllOrders)
apiOrder.put('/:id', authenticationAdmin.validate, Order.updateOrder)
apiOrder.delete('/:id', authenticationAdmin.validate, Order.deleteOrder)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiOrder
