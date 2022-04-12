const express = require('express')
const api = express.Router()
const Installation = require('../../controllers/installation/installation_controller')

/**
 * @swagger
 * components:
 *  schemas:
 *      Installation:
 *          type: object
 *          properties: 
 *              name:
 *                  type: string
 *                  description: nombre de la instalación
 *              autonomous_community:
 *                  type: string
 *                  description: comunidad autónoma de la instalación
 *              code:
 *                  type: string
 *                  description: código de la instalación
 *              address:
 *                  type: string
 *                  description: dirección de la instalación
 *              dealership:
 *                  type: string
 *                  description: agencia a la que pertenece la instalación
 *              installation_type:
 *                  type: string
 *                  description: tipo de instalación a la que pertenece la instalación
 *              population:
 *                  type: string
 *                  description: populatión de la instalación
 *              postal_code:
 *                  type: string
 *                  description: código postal de la instalación.
 *              phone:
 *                  type: string
 *                  description: teléfono de la instalación.
 *              active:
 *                  type: boolean
 *                  description: instalación activa si o no
 *              province:
 *                  type: string
 *                  description: provincia de la instalación.
 *              email:
 *                  type: string
 *                  description: email de la instalación.
 *              latitude:
 *                  type: string
 *                  description: latitud de la instalación
 *              length:
 *                  type: string
 *                  description: tamaño de la instalación.
 *              isSale:
 *                  type: boolean
 *                  description: isSale.
 *              isPostSale:
 *                  type: boolean
 *                  description: isPostSale
 *              isHP:
 *                  type: boolean
 *                  description: isHP.
 *              m2Exp:
 *                  type: number
 *                  description: m2Exp.
 *              m2PostSale:
 *                  type: number
 *                  description: m2PostSale.
 *              m2Rec:
 *                  type: number
 *                  description: m2Rec
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del área.
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - name
 *              - autonomous_community
 *              - code
 *              - address
 *              - dealership
 *              - installation_type
 *              - population
 *              - postal_code
 *              - phone
 *              - active
 *              - province
 *              - email
 *              - latitude
 *              - length
 *              - isSale
 *              - isPostSale
 *              - isHP
 *              - m2Exp
 *              - m2PostSale
 *              - m2Rec
 *              - createdAt
 *              - updatedAt
 *          example:
 *              name: Agencia 1
 *              autonomous_community: autonomous_community
 *              code: code1
 *              address: adress 2020
 *              dealership: 2131280a90dsuuasd23
 *              installation_type: 3120eweqpwoe98
 *              population: population
 *              postal_code: 2000
 *              phone: 341853948
 *              active: true
 *              province: Sevilla
 *              email: email@gmail.com
 *              latitude: 200000
 *              length: 2
 *              isSale: true
 *              isPostSale: true
 *              isHP: true
 *              m2Exp: 2000
 *              m2PostSale: 3000
 *              m2Rec: 1000
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Installation
  *   description: Rutas de Installation
  */

api.post('/all', Installation.getAllInstallation)

/**
 * @swagger
 * /api/installation/all:
 *  post:
 *      summary: Devuelve todas las instalaciones por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Installation]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          description: nombre de la instalación
 *                          example: agencyname
 *                      code:
 *                          type: string
 *                          description: código de la instalación
 *                          example: 1020
 *                      dealership:
 *                          type: string
 *                          description: agencia a la que pertenece la instalación
 *                          example: 213123erew35fd
 *                      installation_type:
 *                          type: string
 *                          description: identificador del tipo de instalación a la que pertenece la instalación
 *                          example: 321312ewr234234
 *                      phone:
 *                          type: string
 *                          description: teléfono de la instalación
 *                          example: 3415775544
 *                      province:
 *                          type: string
 *                          description: provincia de la instalación
 *                          example: Sevilla
 *                      country:
 *                          type: string
 *                          description: país de la instalación
 *                          example: España
 *                      email:
 *                          type: string
 *                          description: email de la instalación
 *                          example: email@gmail.com
 *                      pageReq:
 *                          type: number
 *                          description: Es el número de página, debe ser mayor a cero
 *                          example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todas las instalaciones por paginación, y el total de páginas
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
 *                                               $ref: '#/components/schemas/Installation'
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

api.post('/', Installation.createInstallation)

/**
 * @swagger
 * /api/installation/:
 *  post:
 *      summary: Crea una instalación, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Installation]
 *      requestBody:
 *          required: true
 *          content:    
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *              name:
 *                  type: string
 *                  example: nombre de la instalación
 *              autonomous_community:
 *                  type: string
 *                  example: comunidad autónoma de la instalación
 *              code:
 *                  type: string
 *                  example: código de la instalación
 *              address:
 *                  type: string
 *                  example: dirección de la instalación
 *              dealership:
 *                  type: string
 *                  example: 6254a537a25ee0d4c4e71bae
 *              installation_type:
 *                  type: string
 *                  example: 625494cf52b66d16944982a9
 *              population:
 *                  type: string
 *                  example: populatión de la instalación
 *              postal_code:
 *                  type: string
 *                  example: 2222
 *              phone:
 *                  type: string
 *                  example: 3415223344
 *              active:
 *                  type: boolean
 *                  example: false
 *              province:
 *                  type: string
 *                  example: provincia de la instalación.
 *              email:
 *                  type: string
 *                  example: email@gmail.com
 *              latitude:
 *                  type: string
 *                  example: latitud de la instalación
 *              length:
 *                  type: number
 *                  example: 1
 *              isSale:
 *                  type: boolean
 *                  example: false
 *              isPostSale:
 *                  type: boolean
 *                  example: false
 *              isHP:
 *                  type: boolean
 *                  example: false
 *              m2Exp:
 *                  type: number
 *                  example: 2
 *              m2PostSale:
 *                  type: number
 *                  example: 2
 *              m2Rec:
 *                  type: number
 *                  example: 2
 *              contacts:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificador del personal
 *                  example: ["6254ae32046e35e57ae90dde"]
 *      responses:
 *          201: 
 *              description: Crea una instalación, y retorna sus datos
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
 *                                           installations:
 *                                               $ref: '#/components/schemas/Installation'
 *                                           totalPage: 
 *                                               type: integer
 *                                               example: 2
 *          400:
 *              description:  invalid name/ invalid code/ invalid address/ invalid dealership/ invalid installation_type/ invalid population/ invalid postal_code/ invalid phone/ invalid active/ invalid province/ invalid country/ invalid email/ invalid latitude/invalid length/ invalid previous_year_sales/ invalid referential_sales/ invalid sales_weight_per_installation/ invalid post_sale_spare_parts_previous_year/ invalid post_sale_referential_spare_parts/ invalid post_sale_daily_income/ invalid post_sale_weight_per_installation/ invalid vn_quaterly_billing/ invalid electric_quaterly_billing/ invalid ionic5_quaterly_billing/  
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

api.get('/:id', Installation.getInstallation)

/**
 * @swagger
 * /api/installation/{id}:
 *  get:
 *      summary: Verifica que la instalación exista, y lo devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Installation]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la instalación a buscar
 *      responses:
 *          200: 
 *              description: Devuelve una instalación
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
 *                                  $ref: '#/components/schemas/Installation'
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

api.put('/:id', Installation.updateInstallation)

/**
 * @swagger
 * /api/installation/:
 *  put:
 *      summary: Edita una instalación, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Installation]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la instalación a buscar
 *      requestBody:
 *          required: true
 *          content:    
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *              name:
 *                  type: string
 *                  example: nombre de la instalación
 *              autonomous_community:
 *                  type: string
 *                  example: comunidad autónoma de la instalación
 *              code:
 *                  type: string
 *                  example: código de la instalación
 *              address:
 *                  type: string
 *                  example: dirección de la instalación
 *              dealership:
 *                  type: string
 *                  example: 6254a537a25ee0d4c4e71bae
 *              installation_type:
 *                  type: string
 *                  example: 625494cf52b66d16944982a9
 *              population:
 *                  type: string
 *                  example: populatión de la instalación
 *              postal_code:
 *                  type: string
 *                  example: código postal de la instalación.
 *              phone:
 *                  type: string
 *                  example: 3415667788
 *              active:
 *                  type: boolean
 *                  example: false
 *              province:
 *                  type: string
 *                  example: provincia de la instalación.
 *              email:
 *                  type: string
 *                  example: email@gmail.com
 *              latitude:
 *                  type: string
 *                  example: latitud de la instalación
 *              length:
 *                  type: number
 *                  example: 1
 *              isSale:
 *                  type: boolean
 *                  example: false.
 *              isPostSale:
 *                  type: boolean
 *                  example: false
 *              isHP:
 *                  type: boolean
 *                  example: false.
 *              m2Exp:
 *                  type: number
 *                  example: 1.
 *              m2PostSale:
 *                  type: number
 *                  example: 1.
 *              m2Rec:
 *                  type: number
 *                  example: 1
 *              contacts:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificador del personal
 *                  example: ["6254ae32046e35e57ae90dde"]
 *      responses:
 *          201: 
 *              description: Edita una instalación, y retorna sus datos
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
 *                                           installations:
 *                                               $ref: '#/components/schemas/Installation'
 *                                           totalPage: 
 *                                               type: integer
 *                                               example: 2
 *          400:
 *              description:  invalid name/ invalid code/ invalid address/ invalid dealership/ invalid installation_type/ invalid population/ invalid postal_code/ invalid phone/ invalid active/ invalid province/ invalid country/ invalid email/ invalid latitude/invalid length/ invalid previous_year_sales/ invalid referential_sales/ invalid sales_weight_per_installation/ invalid post_sale_spare_parts_previous_year/ invalid post_sale_referential_spare_parts/ invalid post_sale_daily_income/ invalid post_sale_weight_per_installation/ invalid vn_quaterly_billing/ invalid electric_quaterly_billing/ invalid ionic5_quaterly_billing/  
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

api.delete('/:id', Installation.deleteInstallation)

/**
 * @swagger
 * /api/installation/{id}:
 *  delete:
 *      summary: Elimina una instalación, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Installation]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la instalación  a eliminar
 *      responses:
 *          200: 
 *              description: Elimina una instalación, y devuelve sus datos
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
 *                                  example: the Installation has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Installation'
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

module.exports = api
