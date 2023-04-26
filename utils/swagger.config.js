const path = require('path')

const swaggerSpecification = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HYUNDAI BACKEND',
      version: '1.0'
    },
    servers: [
      {
        url: 'https://hyundairetinna.herokuapp.com',
        description: 'heroku server'
      },
      {
        url: 'http://localhost:4000',
        description: 'Local server'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],  
  },
  apis: [
    `${path.join(__dirname, '../routes/admin/admin_routes.js')}`,
    `${path.join(__dirname, '../routes/category/category_routes.js')}`,
    `${path.join(__dirname, '../routes/block/block_routes.js')}`,
    `${path.join(__dirname, '../routes/area/area_routes.js')}`,
    `${path.join(__dirname, '../routes/standard/standard_routes.js')}`,
    `${path.join(__dirname, '../routes/criterion/criterion_routes.js')}`,
    `${path.join(__dirname, '../routes/auditResponsable/auditResponsable_routes.js')}`,
    `${path.join(__dirname, '../routes/criterionType/criterionType_routes.js')}`,
    `${path.join(__dirname, '../routes/installationType/installationType_routes.js')}`,
    `${path.join(__dirname, '../routes/role/role_routes.js')}`,
    `${path.join(__dirname, '../routes/personal/personal_routes.js')}`,
    `${path.join(__dirname, '../routes/dealership/dealership_routes.js')}`,
    `${path.join(__dirname, '../routes/installation/installation_routes.js')}`,
    `${path.join(__dirname, '../routes/cloudinary/cloudinary_routes.js')}`,
    `${path.join(__dirname, '../routes/audit/audit_routes.js')}`,
    `${path.join(__dirname, '../routes/auditResults/auditResults_routes.js')}`,
  ],
}

module.exports = {swaggerSpecification}
