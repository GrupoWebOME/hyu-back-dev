const express = require('express')
const api = express.Router()
const Dealership = require('../../controllers/dealership/dealership_controller')

/**
 * @swagger
 * components:
 *  schemas:
 *      Dealership:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id de la agencia
 *              name:
 *                  type: string
 *                  description: nombre de la agencia
 *              address:
 *                  type: string
 *                  description: dirección de la agencia
 *              code:
 *                  type: string
 *                  description: código de la agencia
 *              installations:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: instalaciones que pertenecen a la agencia
 *              location:
 *                  type: string
 *                  description: localización de la agencia
 *              province:
 *                  type: string
 *                  description: provincia de la agencia
 *              autonomous_community:
 *                  type: string
 *                  description: comunidad autónoma de la agencia
 *              postal_code:
 *                  type: string
 *                  description: código postal
 *              name_surname_manager:
 *                  type: string
 *                  description: nombre y apellido del manager
 *              phone:
 *                  type: string
 *                  description: teléfono de la agencia
 *              previous_year_sales:
 *                  type: number
 *                  description: Ventas del año pasado
 *              email:
 *                  type: string
 *                  description: email de la agencia
 *              post_sale_referential_spare_parts:
 *                  type: number
 *                  description: repuestos referenciales post venta.
 *              post_sale_spare_parts_previous_year:
 *                  type: number
 *                  description: repuestos referenciales post venta del año previo
 *              post_sale_daily_income:
 *                  type: number
 *                  description: ingresos diarios post venta.
 *              sales_weight_per_installation:
 *                  type: number
 *                  description: peso de venta por instalación.
 *              post_sale_weight_per_installation:
 *                  type: number
 *                  description: peso post venta por instalación.
 *              vn_quaterly_billing:
 *                  type: number
 *                  description: facturación cuatrimestral vn.
 *              electric_quaterly_billing:
 *                  type: number
 *                  description: facturacion electrica trimestral.
 *              ionic5_quaterly_billing:
 *                  type: number
 *                  description: facturación cuatrimestral ionic5.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del área.
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - id
 *              - name
 *              - address
 *              - code
 *              - installations
 *              - location
 *              - province
 *              - autonomous_community
 *              - postal_code
 *              - name_surname_manager
 *              - phone
 *              - previous_year_sales
 *              - email
 *              - post_sale_referential_spare_parts
 *              - post_sale_spare_parts_previous_year
 *              - post_sale_daily_income
 *              - sales_weight_per_installation
 *              - post_sale_weight_per_installation
 *              - vn_quaterly_billing
 *              - electric_quaterly_billing
 *              - ionic5_quaterly_billing
 *              - createdAt
 *              - updatedAt
 *          example:
 *              name: Agencia
 *              address: Pellegrini 2020
 *              code: 2020
 *              installations: []
 *              location: location
 *              province: Sevilla
 *              autonomous_community: autonomous_community
 *              postal_code: postal_code
 *              name_surname_manager: Carlos Marquez
 *              phone: 5493415883377
 *              previous_year_sales: 2
 *              email: email@gmail.com
 *              post_sale_referential_spare_parts: 0
 *              post_sale_spare_parts_previous_year: 0
 *              post_sale_daily_income: 0
 *              sales_weight_per_installation: 0
 *              post_sale_weight_per_installation: 0
 *              vn_quaterly_billing: 0
 *              electric_quaterly_billing: 0
 *              ionic5_quaterly_billing: 0
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Dealership
  *   description: Rutas de Agencias
  */

api.get('/:id', Dealership.getDealership)

/**
 * @swagger
 * /api/dealership/{id}:
 *  get:
 *      summary: Verifica que la agencia exista, y lo devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Dealership]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la agencia a buscar
 *      responses:
 *          200: 
 *              description: Devuelve una agencia
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 200
 *                              msg:
 *                                  type: string
 *                                  example: success
 *                              data:
 *                                  $ref: '#/components/schemas/Dealership'
 *          400: 
 *              description: invalid id 
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 400
 *                              msg:
 *                                  type: string
 *                                  example: invalid id
 *                              detail: 
 *                                  type: string
 *                                  example: id should be a objectId format
 *          401: 
 *              description: invalid token
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 401
 *                              msg:
 *                                  type: string
 *                                  example: invalid token
 *                              detail: 
 *                                  type: string
 *                                  example: you don't have permission
 *          500:
 *              description: server error
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 500
 *                              msg:
 *                                  type: string
 *                                  example: server error
 *                              detail: 
 *                                  type: string
 *                                  example: something went wrong on the server
 */

api.post('/all', Dealership.getAllDealership)

/**
 * @swagger
 * /api/dealership/all:
 *  post:
 *      summary: Devuelve todas las agencias por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Dealership]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          description: nombre de la agencia
 *                          example: agencyname
 *                      address:
 *                          type: string
 *                          description: dirección de la agencia
 *                          example: pellegrini 2020
 *                      province:
 *                          type: string
 *                          description: provincia de la agencia
 *                          example: province
 *                      pageReq:
 *                          type: number
 *                          description: Es el número de página, debe ser mayor a cero
 *                          example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todas las agencias por paginación, y el total de páginas
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 200
 *                              msg:
 *                                  type: string
 *                                  example: success
 *                              data:
 *                                  type: array
 *                                  items:
 *                                       properties:
 *                                           area:
 *                                               $ref: '#/components/schemas/Dealership'
 *                                           totalPages: 
 *                                               type: integer
 *                                               example: 2
 *          400: 
 *              description: invalid page
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 400
 *                              msg:
 *                                  type: string
 *                                  example: invalid page
 *                              detail: 
 *                                  type: string
 *                                  example: page should be a positive integer
 *          401: 
 *              description: invalid token
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 401
 *                              msg:
 *                                  type: string
 *                                  example: invalid token
 *                              detail: 
 *                                  type: string
 *                                  example: you don't have permission
 *          500:
 *              description: server error
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 500
 *                              msg:
 *                                  type: string
 *                                  example: server error
 *                              detail: 
 *                                  type: string
 *                                  example: something went wrong on the server
 */

api.post('/', Dealership.createDealership)

/**
 * @swagger
 * /api/dealership/:
 *  post:
 *      summary: Crea una agencia, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Dealership]
 *      requestBody:
 *          required: true
 *          content:    
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *                name:
 *                  type: string
 *                  description: nombre de la agencia
 *                  example: Agencia 1
 *                address:
 *                  type: string
 *                  description: dirección de la agencia
 *                  example: Dirección 2233
 *                code:
 *                  type: string
 *                  description: código de la agencia
 *                  example: 123145
 *                location:
 *                  type: string
 *                  description: localización de la agencia
 *                  example: location1
 *                province:
 *                  type: string
 *                  description: provincia de la agencia
 *                  example: Provincia
 *                autonomous_community:
 *                  type: string
 *                  description: comunidad autónoma de la agencia
 *                  example: comunidad autónoma
 *                postal_code:
 *                  type: string
 *                  description: código postal
 *                  example: 2000
 *                name_surname_manager:
 *                  type: string
 *                  description: nombre y apellido del manager
 *                  example: gregorio perez
 *                phone:
 *                  type: string
 *                  description: teléfono de la agencia
 *                  example: 3415998877
 *                previous_year_sales:
 *                  type: number
 *                  description: Ventas del año pasado
 *                  example: 0
 *                email:
 *                  type: string
 *                  description: email de la agencia
 *                  example: email@gmail.com
 *                post_sale_referential_spare_parts:
 *                  type: number
 *                  description: repuestos referenciales post venta.
 *                  example: 0
 *                post_sale_spare_parts_previous_year:
 *                  type: number
 *                  description: repuestos referenciales post venta del año previo
 *                  example: 0
 *                post_sale_daily_income:
 *                  type: number
 *                  description: ingresos diarios post venta.
 *                  example: 0
 *                sales_weight_per_installation:
 *                  type: number
 *                  description: peso de venta por instalación.
 *                  example: 0
 *                post_sale_weight_per_installation:
 *                  type: number
 *                  description: peso post venta por instalación.
 *                  example: 0
 *                vn_quaterly_billing:
 *                  type: number
 *                  description: facturación cuatrimestral vn.
 *                  example: 0
 *                electric_quaterly_billing:
 *                  type: number
 *                  description: facturacion electrica trimestral.
 *                  example: 0
 *                ionic5_quaterly_billing:
 *                  type: number
 *                  description: facturación cuatrimestral ionic5.
 *                  example: 0
 *      responses:
 *          201: 
 *              description: Crea una agencia, y retorna sus datos
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 200
 *                              msg:
 *                                  type: string
 *                                  example: success
 *                              data:
 *                                  type: array
 *                                  items:
 *                                       properties:
 *                                           dealerships:
 *                                               $ref: '#/components/schemas/Dealership'
 *                                           totalPage: 
 *                                               type: integer
 *                                               example: 2
 *          400:
 *              description:  invalid name/ invalid code/ invalid address/ invalid location/ invalid province/ invalid postal_code/ invalid phone/ invalid email/ invalid name_surname_manager/ invalid previous_year_sales/ invalid referential_sales/ invalid post_sale_spare_parts_previous_year/ invalid post_sale_referential_spare_parts/ invalid sales_weight_per_installation/ invalid post_sale_weight_per_installation/ invalid vn_quaterly_billing/ invalid electric_quaterly_billing/ invalid ionic5_quaterly_billing/ invalid post_sale_daily_income
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 400
 *                              msg:
 *                                  type: string
 *                                  example: invalid code
 *                              detail: 
 *                                  type: string
 *                                  example: code is already exist
 *          401: 
 *              description: invalid token
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 401
 *                              msg:
 *                                  type: string
 *                                  example: invalid token
 *                              detail: 
 *                                  type: string
 *                                  example: you don't have permission
 *          500:
 *              description: server error
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 500
 *                              msg:
 *                                  type: string
 *                                  example: server error
 *                              detail: 
 *                                  type: string
 *                                  example: something went wrong on the server
 */

api.put('/:id', Dealership.updateDealership)

/**
 * @swagger
 * /api/dealership/:
 *  put:
 *      summary: Crea un tipo de criterio responsable
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Dealership]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la agencia reponsable a buscar
 *      requestBody:
 *          required: true
 *          content:    
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                name:
 *                  type: string
 *                  example: Agencia 2
 *                address:
 *                  type: string
 *                  example: dirección de la agencia
 *                code:
 *                  type: string
 *                  example: 213234234
 *                location:
 *                  type: string
 *                  example: localización de la agencia
 *                province:
 *                  type: string
 *                  example: provincia de la agencia
 *                autonomous_community:
 *                  type: string
 *                  example: comunidad autónoma de la agencia
 *                postal_code:
 *                  type: string
 *                  example: código postal
 *                name_surname_manager:
 *                  type: string
 *                  example: nombre y apellido del manager
 *                phone:
 *                  type: string
 *                  example: 3415664322
 *                previous_year_sales:
 *                  type: number
 *                  example: 0
 *                email:
 *                  type: string
 *                  example: email@gmail.com
 *                post_sale_referential_spare_parts:
 *                  type: number
 *                  example: 0
 *                post_sale_spare_parts_previous_year:
 *                  type: number
 *                  example: 0
 *                post_sale_daily_income:
 *                  type: number
 *                  example: 0
 *                sales_weight_per_installation:
 *                  type: number
 *                  example: 0
 *                post_sale_weight_per_installation:
 *                  type: number
 *                  example: 0
 *                vn_quaterly_billing:
 *                  type: number
 *                  example: 0
 *                electric_quaterly_billing:
 *                  type: number
 *                  example: 0
 *                ionic5_quaterly_billing:
 *                  type: number
 *                  example: 0
 *      responses:
 *          200: 
 *              description: Edita una agencia, y retorna los datos actualizados
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 200
 *                              msg:
 *                                  type: string
 *                                  example: success
 *                              data:
 *                                  type: array
 *                                  items:
 *                                       properties:
 *                                           area:
 *                                               $ref: '#/components/schemas/Dealership'
 *                                           totalPage: 
 *                                               type: integer
 *                                               example: 2
 *          400: 
 *              description: invalid id/ invalid name/ invalid code/ invalid address/ invalid location/ invalid province/ invalid postal_code/ invalid phone/ invalid email/ invalid name_surname_manager/ invalid previous_year_sales/ invalid referential_sales/ invalid post_sale_spare_parts_previous_year/ invalid post_sale_referential_spare_parts/ invalid sales_weight_per_installation/ invalid post_sale_weight_per_installation/ invalid vn_quaterly_billing/ invalid electric_quaterly_billing/ invalid ionic5_quaterly_billing/ invalid post_sale_daily_income
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 400
 *                              msg:
 *                                  type: string
 *                                  example: invalid id
 *                              detail: 
 *                                  type: string
 *                                  example: id should be a objectid
 *          401: 
 *              description: invalid token
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 401
 *                              msg:
 *                                  type: string
 *                                  example: invalid token
 *                              detail: 
 *                                  type: string
 *                                  example: you don't have permission
 *          500:
 *              description: server error
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 500
 *                              msg:
 *                                  type: string
 *                                  example: server error
 *                              detail: 
 *                                  type: string
 *                                  example: something went wrong on the server
 */

api.delete('/:id', Dealership.deleteDealership)

/**
 * @swagger
 * /api/dealership/{id}:
 *  delete:
 *      summary: Elimina una agencia, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Dealership]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la agencia a eliminar
 *      responses:
 *          200: 
 *              description: Elimina una agencia, y devuelve sus datos
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 201
 *                              msg:
 *                                  type: string
 *                                  example: the dealership has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Dealership'
 *          400: 
 *              description: invalid id
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 400
 *                              msg:
 *                                  type: string
 *                                  example: invalid id
 *                              detail: 
 *                                  type: string
 *                                  example: id should be a objectId format
 *          401: 
 *              description: invalid token
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 401
 *                              msg:
 *                                  type: string
 *                                  example: invalid token
 *                              detail: 
 *                                  type: string
 *                                  example: you don't have permission
 *          500:
 *              description: server error
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: number
 *                                  example: 500
 *                              msg:
 *                                  type: string
 *                                  example: server error
 *                              detail: 
 *                                  type: string
 *                                  example: something went wrong on the server
 */

 api.get('/:id', Dealership.getAllDealershipByAuditID)

module.exports = api
