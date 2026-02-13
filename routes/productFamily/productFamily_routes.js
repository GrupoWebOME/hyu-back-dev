const express = require('express')
const apiProductFamily = express.Router()
const ProductFamily = require('../../controllers/productFamily/product_family_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

apiProductFamily.post('/', authenticationAdmin.validate, ProductFamily.createProductFamily)
apiProductFamily.post('/all', authenticationAdmin.validate, ProductFamily.getAllProductsFamilies)
apiProductFamily.put('/:id', authenticationAdmin.validate, ProductFamily.updateProductFamily)
apiProductFamily.delete('/:id', authenticationAdmin.validate, ProductFamily.deleteProductFamily)
/*
apiAdmin.get('/:id', authenticationAdminMain.validate, Admin.getAdmin)
*/
module.exports = apiProductFamily
