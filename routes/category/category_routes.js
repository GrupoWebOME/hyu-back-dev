const express = require('express')
const api = express.Router()
const Category = require('../../controllers/category/category_controller')
const authenticationAdminMain = require('../../middlewares/authenticationAdminMain')

/**
 * @swagger
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id de la categoría
 *              name:
 *                  type: string
 *                  description: nombre de la categoría
 *              abbreviation:
 *                  type: string
 *                  description: abreviación de la categoría
 *              value:
 *                  type: string
 *                  description: valor de la categoría
 *              blocks:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificadores del bloque
 *              isAgency:
 *                  type: boolean
 *                  description: Si es true, implica ques aplica a las agencias, si es false aplica a las instalaciones.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación de la categoría
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - id
 *              - name
 *              - abbreviation
 *              - value
 *              - blocks
 *              - isAgency
 *              - createdAt
 *              - updatedAt
 *          example:
 *              id: 61799aff1c4a2a001602ab4e
 *              name: General
 *              abbreviation: GR
 *              value: 1
 *              blocks: 61799ab01c4a2a001602ab4e
 *              isAgency: false
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Category
  *   description: Rutas de Categorías
  */

api.post('/all', authenticationAdminMain.validate, Category.getAllCategories)

/**
 * @swagger
 * /api/category/all:
 *  post:
 *      summary: Devuelve todas las categorías por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Category]
 *      parameters:
 *          - in: path
 *            name: page
 *            schema:
 *              type: integer
 *              minimun: 0
 *              nullable: false
 *            required: true
 *            description: página a buscar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre de la categoría.
 *                      example: General
 *                    abbreviation:
 *                      type: string
 *                      description: Abreviación de la categoría.
 *                      example: GR
 *                    value:
 *                      type: number
 *                      description: valor de la categoría.
 *                      example: 2
 *                    installationType:
 *                      type: string
 *                      description: Identificador del tipo de instalación.
 *                      example: 132312erew34233432
 *                    isAgency:
 *                      type: boolean
 *                      description: Si es true muestra agencias, si es false muestra instalaciones
 *                      example: false
 *                    pageReq:
 *                      type: number
 *                      description: Es el número de página, debe ser mayor a cero
 *                      example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todas las categorías por paginación, y el total de páginas
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
 *                                           categories:
 *                                               $ref: '#/components/schemas/Category'
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

api.post('/', authenticationAdminMain.validate, Category.createCategory)

/**
 * @swagger
 * /api/category/:
 *  post:
 *      summary: Crea una nueva categoría, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Category]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre de la categoría.
 *                      example: General
 *                    abbreviation:
 *                      type: string
 *                      description: Abreviación de la categoría.
 *                      example: GR
 *                    isAgency:
 *                      type: boolean
 *                      description: Define si se aplica a las agencias, o a las instalaciones.
 *                      example: false
 *                  required:
 *                    - name
 *                    - abbreviation
 *                    - isAgency
 *      responses:
 *          201: 
 *              description: Crea una categoría
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
 *                                  example: the category has been created successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Category'
 *          400: 
 *              description: invalid name / invalid abbreviation / invalid isAgency
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: string
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
 *                                  type: string
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
 *                                  type: string
 *                                  example: 500
 *                              msg:
 *                                  type: string
 *                                  example: server error
 *                              detail: 
 *                                  type: string
 *                                  example: something went wrong on the server
 */

api.get('/:id', authenticationAdminMain.validate, Category.getCategory)

/**
 * @swagger
 * /api/category/{id}:
 *  get:
 *      summary: Verifica que la categoría exista, y la devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Category]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la categoría a buscar
 *      responses:
 *          200: 
 *              description: Devuelve una categoría
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
 *                                  $ref: '#/components/schemas/Category'
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

api.put('/:id', authenticationAdminMain.validate, Category.updateCategory)

/**
 * @swagger
 * /api/category/{id}:
 *  put:
 *      summary: Edita una categoría, y retorna sus datos actualizados
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Category]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la categoría a editar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre de la categoría.
 *                      example: General
 *                    abbreviation:
 *                      type: string
 *                      description: Abreviación de la categoría.
 *                      example: GR
 *      responses:
 *          200: 
 *              description: Edita una categoría
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
 *                                  example: the category has been edited successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Category'
 *          400: 
 *              description: invalid name / invalid abbreviation
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              code: 
 *                                  type: string
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
 *                                  type: string
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
 *                                  type: string
 *                                  example: 500
 *                              msg:
 *                                  type: string
 *                                  example: server error
 *                              detail: 
 *                                  type: string
 *                                  example: something went wrong on the server
 */

api.delete('/:id', authenticationAdminMain.validate, Category.deleteCategory)

/**
 * @swagger
 * /api/category/{id}:
 *  delete:
 *      summary: Elimina una categoría, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Category]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la categoría a eliminar
 *      responses:
 *          200: 
 *              description: Elimina una categoría, y devuelve sus datos
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
 *                                  example: the category has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Category'
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
