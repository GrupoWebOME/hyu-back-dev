const express = require('express')
const apiProduct = express.Router()
const Product = require('../../controllers/product/product_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiProduct.post('/', authenticationAdmin.validate, Product.createProduct)
apiProduct.post('/all', authenticationAdmin.validate, Product.getAllProducts)
apiProduct.put('/:id', authenticationAdmin.validate, Product.updateProduct)
apiProduct.delete('/:id', authenticationAdmin.validate, Product.deleteProduct)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiProduct
