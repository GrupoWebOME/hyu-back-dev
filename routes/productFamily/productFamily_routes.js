const express = require('express')
const apiProductFamily = express.Router()
const ProductFamily = require('../../controllers/productFamily/product_family_controller')

apiProductFamily.post('/', ProductFamily.createProductFamily)
apiProductFamily.post('/all', ProductFamily.getAllProductsFamilies)
apiProductFamily.put('/:id', ProductFamily.updateProductFamily)
apiProductFamily.delete('/:id', ProductFamily.deleteProductFamily)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiProductFamily
