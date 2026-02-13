const express = require('express')
const api = express.Router()
const Area = require('../../controllers/area/area_controller')
// const authenticationAdminMain = require('../../middlewares/authenticationAdminMain')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

/**
 * @swagger
 * components:
 *  schemas:
 *      Area:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id del área
 *              name:
 *                  type: string
 *                  description: nombre del área
 *              value:
 *                  type: number
 *                  description: valor del área
 *              number:
 *                  type: number
 *                  description: valor del área
 *              description:
 *                  type: string
 *                  description: descripción del área
 *              isException:
 *                  type: boolean
 *                  description: Si es true, implica que puede tener excepciones.
 *              isAgency:
 *                  type: boolean
 *                  description: Si es true, implica que aplica a agencias, si es false aplica a instalaciones.
 *              exceptions:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificadores de instalaciones y/o agencias.
 *              standards:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificadores del standard.
 *              block:
 *                    type: string
 *                    description: identificador del bloque
 *              category:
 *                  type: string
 *                  description: identificador de la categoría.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del área.
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - id
 *              - name
 *              - value
 *              - number
 *              - description
 *              - isException
 *              - exceptions
 *              - isAgency
 *              - standards
 *              - block
 *              - category
 *              - createdAt
 *              - updatedAt
 *          example:
 *              id: 61799ab01c4a2a001602ab4z
 *              name: Bloque
 *              value: 12
 *              number: 1
 *              description: Descripción del bloque
 *              isException: false
 *              exceptions: null
 *              isAgency: false
 *              standards: [61799ab01c4a2a001602ab4e]
 *              block: 21799ab01c4a2a001633ab3e
 *              category: a1799cc01c4a2a001633ab3e
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Area
  *   description: Rutas de Areas
  */

api.post('/all', authenticationAdmin.validate, Area.getAllArea)

/**
 * @swagger
 * /api/area/all:
 *  post:
 *      summary: Devuelve todas las áreas por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Area]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre del área.
 *                      example: Area name
 *                    description:
 *                      type: string
 *                      description: Descripción del área.
 *                      example: Descripción
 *                    number:
 *                      type: number
 *                      description: Número de área'.
 *                      example: 1
 *                    isAgency:
 *                      type: boolean
 *                      description: Si es true muestra agencias, si es false muestra instalaciones
 *                      example: false
 *                    block:
 *                      type: string
 *                      description: Identificador del bloque
 *                      example: 145353uert8352349
 *                    pageReq:
 *                      type: number
 *                      description: Es el número de página, debe ser mayor a cero
 *                      example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todas las áreas por paginación, y el total de páginas
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
 *                                           areas:
 *                                               $ref: '#/components/schemas/Area'
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

api.post('/', authenticationAdmin.validate, Area.createArea)

/**
 * @swagger
 * /api/area/:
 *  post:
 *      summary: Crea una nueva Area, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Area]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre del Area.
 *                      example: General
 *                    number:
 *                      type: number
 *                      description: número del Area.
 *                      example: 1
 *                    description:
 *                      type: string
 *                      description: descripción del Area.
 *                      example: descripción
 *                    isException:
 *                      type: boolean
 *                      description: Define si el área es permeable a excepciones o no.
 *                      example: false
 *                    isAgency:
 *                      type: boolean
 *                      description: Define si aplica a agencias o instalaciones.
 *                      example: false
 *                    block:
 *                      type: string
 *                      description: Identificador del Bloque
 *                      example: '62547b0602d3f3540242d92a'
 *                  required:
 *                    - name
 *                    - number
 *                    - description
 *                    - isException
 *                    - isAgency
 *                    - block
 *      responses:
 *          201: 
 *              description: Crea un Área, y retorna sus datos
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
 *                                  example: the Area has been created successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Area'
 *          400: 
 *              description: invalid name / invalid number / invalid description/ invalid isException/ invalid isAgency/ invalid block
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
 *                                  example: invalid number
 *                              detail: 
 *                                  type: string
 *                                  example: number should be a number format
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

api.get('/:id', authenticationAdmin.validate, Area.getArea)

/**
 * @swagger
 * /api/area/{id}:
 *  get:
 *      summary: Verifica que el área exista, y la devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Area]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del área a buscar
 *      responses:
 *          200: 
 *              description: Devuelve un área
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
 *                                  $ref: '#/components/schemas/Area'
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

api.put('/:id', authenticationAdmin.validate, Area.updateArea)

/**
 * @swagger
 * /api/area/:
 *  put:
 *      summary: Edita un Area, y retorna sus datos actualizados
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Area]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema: 
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre del Area.
 *                      example: General
 *                    number:
 *                      type: string
 *                      description: Número del Area.
 *                      example: General
 *                    description:
 *                      type: string
 *                      description: descripción del Area.
 *                      example: descripción
 *                    isException:
 *                      type: boolean
 *                      description: Define si el área es permeable a excepciones o no.
 *                      example: false
 *                  required:
 *                    - name
 *                    - number
 *                    - description
 *                    - isException
 *      responses:
 *          201: 
 *              description: Edita un Área, y retorna sus datos actualizados
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
 *                                  example: the Area has been created successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Area'
 *          400: 
 *              description: invalid name / invalid number / invalid description/ invalid isException
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

api.delete('/:id', authenticationAdmin.validate, Area.deleteArea)

/**
 * @swagger
 * /api/area/{id}:
 *  delete:
 *      summary: Elimina un área, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Area]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del área a eliminar
 *      responses:
 *          200: 
 *              description: Elimina un área, y devuelve sus datos
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
 *                                  example: the area has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Area'
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