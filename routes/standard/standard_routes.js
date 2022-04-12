const express = require('express')
const api = express.Router()
const Standard = require('../../controllers/standard/standard_controller')

/**
 * @swagger
 * components:
 *  schemas:
 *      Standard:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id del standard
 *              description:
 *                  type: string
 *                  description: descripción del standard
 *              value:
 *                  type: number
 *                  description: valor del standard
 *              number:
 *                  type: number
 *                  description: número del standard
 *              isException:
 *                  type: boolean
 *                  description: Informa si el standard es permeable a excepciones.
 *              exceptions:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: identidicador de la instalación/agencia
 *              comment:
 *                  type: string
 *                  description: comentario del standard
 *              isCore:
 *                  type: boolean
 *                  description: Define si es core o no.
 *              isAgency:
 *                  type: boolean
 *                  description: Define si es core o no.
 *              criterions:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificadores de criterios.
 *              area:
 *                  type: string
 *                  description: identificador del área.
 *              block:
 *                  type: string
 *                  description: identificador del bloque.
 *              category:
 *                  type: string
 *                  description: identificador de la categoría.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del standard.
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required: 
 *              - description
 *              - value
 *              - number
 *              - isException
 *              - exceptions
 *              - comment
 *              - isCore
 *              - isAgency
 *              - criterions
 *              - area
 *              - block
 *              - category
 *              - createdAt
 *              - updatedAt
 *          example:
 *              description: Descripción del standard
 *              value: 12
 *              number: 1
 *              isException: false
 *              exceptions: null
 *              comment: comentario
 *              isCore: false
 *              isAgency: false
 *              criterions: [61796ab01c4a2a001602ab4e]
 *              area: 6254849cce4094c5e6973d4b
 *              block: a2799cc01c4a2a001633ab3e
 *              category: a2799c12124a2a001633ab3e
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Standard
  *   description: Rutas de Standard
  */

api.post('/all', Standard.getAllStandard)

/**
 * @swagger
 * /api/standard/all:
 *  post:
 *      summary: Devuelve todos los standards por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Standard]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema: 
 *                  type: object
 *                  properties:
 *                    description:
 *                      type: string
 *                      description: Descripción del standard.
 *                      example: Descripción
 *                    isCore:
 *                      type: boolean
 *                      description: Si es true es core, si es false no lo es.
 *                      example: false
 *                    isException:
 *                      type: boolean
 *                      description: Si es true es permeable a excepciones
 *                      example: true
 *                    area:
 *                      type: string
 *                      description: identificador de área
 *                      example: 6254849cce4094c5e6973d4b
 *                    value:
 *                      type: number
 *                      description: valor de standard
 *                      example: 1
 *                    isAgency:
 *                      type: boolean
 *                      description: especifica si aplica a instalaciones o a agencias
 *                      example: true
 *                    pageReq:
 *                      type: number
 *                      description: Es el número de página, debe ser mayor a cero
 *                      example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todos los standars por paginación, y el total de páginas
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
 *                                           standards:
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

api.post('/', Standard.createStandard)

/**
 * @swagger
 * /api/standard/:
 *  post:
 *      summary: Crea un nuevo standard, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Standard]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    description:
 *                      type: string
 *                      description: Descripción del standard.
 *                      example: Descripción de standard
 *                    comment:
 *                      type: string
 *                      description: comentario del standard.
 *                      example: comentario de standard
 *                    isCore:
 *                      type: boolean 
 *                      description: Si es true es core, si es false no lo es.
 *                      example: false
 *                    isException:
 *                      type: boolean
 *                      description: Si es true es permeable a excepciones
 *                      example: true
 *                    number:
 *                      type: number
 *                      description: número de standard.
 *                      example: 1
 *                    area:
 *                      type: string
 *                      description: identificador de área
 *                      example: 6254849cce4094c5e6973d4b
 *                    isAgency:
 *                      type: boolean
 *                      description: especifica si aplica a instalaciones o a agencias
 *                  required:
 *                    - description
 *                    - number
 *                    - comment  
 *                    - isCore
 *                    - isException
 *                    - isAgency
 *                    - area
 *      responses:
 *          201: 
 *              description: Crea un standard, y retorna sus datos
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
 *                                  example: the Standard has been created successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Standard'
 *          400: 
 *              description: invalid description / invalid number / invalid comment/ invalid isCore/ invalid isException/ invalid isAgency/ invalid area
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

api.get('/:id', Standard.getStandard)

/**
 * @swagger
 * /api/standard/{id}:
 *  get:
 *      summary: Verifica que el standard exista, y lo devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Standard]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del standard a buscar
 *      responses:
 *          200: 
 *              description: Devuelve un standard
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
 *                                  $ref: '#/components/schemas/Standard'
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

api.put('/:id', Standard.updateStandard)

/**
 * @swagger
 * /api/standard/:
 *  put:
 *      summary: Crea un nuevo standard, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Standard]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del standard a eliminar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    description:
 *                      type: string
 *                      description: Descripción del standard.
 *                      example: Descripción
 *                    comment:
 *                      type: string
 *                      description: comentario del standard.
 *                      example: comentario
 *                    isCore:
 *                      type: boolean
 *                      description: Si es true es core, si es false no lo es.
 *                      example: false
 *                    isException:
 *                      type: boolean
 *                      description: Si es true es permeable a excepciones
 *                      example: true
 *                    number:
 *                      type: number
 *                      description: número de standard.
 *                      example: 1
 *                    isAgency:
 *                      type: boolean
 *                      description: especifica si aplica a instalaciones o a agencias
 *                  required:
 *                    - description
 *                    - number
 *                    - comment  
 *                    - isCore
 *                    - isException
 *                    - isAgency
 *                    - area
 *      responses:
 *          200: 
 *              description: Edita un standard, y retorna sus datos
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
 *                                  example: the Standard has been edited successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Standard'
 *          400: 
 *              description: invalid description / invalid number / invalid comment/ invalid isCore/ invalid isException
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

api.delete('/:id', Standard.deleteStandard)

/**
 * @swagger
 * /api/standard/{id}:
 *  delete:
 *      summary: Elimina un standard, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Standard]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del standard a eliminar
 *      responses:
 *          200: 
 *              description: Elimina un standard, y devuelve sus datos
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
 *                                  example: the standard has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Standard'
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