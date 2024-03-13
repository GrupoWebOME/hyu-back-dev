const express = require('express')
const apiProduct = express.Router()
const Product = require('../../controllers/product/product_controller')

apiProduct.post('/', Product.createProduct)
apiProduct.post('/all', Product.getAllProducts)
apiProduct.put('/:id', Product.updateProduct)
apiProduct.delete('/:id', Product.deleteProduct)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiProduct
