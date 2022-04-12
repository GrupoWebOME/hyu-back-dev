const express = require('express')
const api = express.Router()
const Block = require('../../controllers/block/block_controller')

/**
 * @swagger
 * components:
 *  schemas:
 *      Block:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id de la categoría
 *              name:
 *                  type: string
 *                  description: nombre de la categoría
 *              value:
 *                  type: string
 *                  description: valor de la categoría
 *              number:
 *                  type: string
 *                  description: identificadores del bloque
 *              areas:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificadores del área
 *              category:
 *                  type: string
 *                  description: Identificador de la cateogoría.
 *              isAgency:
 *                  type: boolean
 *                  description: Si es true se aplica a agencias, si es false se aplica a instalaciones.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del bloque
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - id
 *              - name
 *              - value
 *              - number
 *              - areas
 *              - category
 *              - isAgency
 *              - createdAt
 *              - updatedAt
 * 
 *          example:
 *              id: 41799ab01c4a2a001622abfe
 *              name: Bloque
 *              value: 1
 *              number: 1
 *              areas: ['61799ab01c4a2a001602ab4e']
 *              category: 41799ab01c4a2a001622ab4e
 *              isAgency: false
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Block
  *   description: Rutas de Categorías
  */

api.post('/all', Block.getAllBlock)

/**
 * @swagger
 * /api/block/all:
 *  post:
 *      summary: Devuelve todas los bloques por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Block]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre del bloque.
 *                      example: Bloque
 *                    value:
 *                      type: number
 *                      description: Abreviación del bloque.
 *                      example: 1
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
 *              description: Devuelve todos los bloques por paginación, y el total de páginas
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
 *                                           blocks:
 *                                               $ref: '#/components/schemas/Block'
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

api.post('/', Block.createBlock)

/**
 * @swagger
 * /api/block/:
 *  post:
 *      summary: Crea una nuevo bloque, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Block]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre del bloque.
 *                      example: Block
 *                    number:
 *                      type: number
 *                      description: número asociado al bloque.
 *                      example: 1    
 *                    category: 
 *                      type: string
 *                      description: Identificador de categoría
 *                      example: 62547534846943289539dff4
 *                    isAgency:
 *                      type: boolean
 *                      description: Define si se aplica a las agencias, o a las instalaciones.
 *                      example: false
 *                  required:
 *                    - name
 *                    - number
 *                    - category
 *                    - isAgency
 *      responses:
 *          201: 
 *              description: Crea un bloque, y retorna sus datos
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
 *                                  example: the block has been created successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Block'
 *          400: 
 *              description: invalid name / invalid category/ invalid number/ invalid isAgency
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
 *                                  example: invalid name
 *                              detail: 
 *                                  type: string
 *                                  example: name is an obligatory field
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

api.get('/:id', Block.getBlock)

/**
 * @swagger
 * /api/block/{id}:
 *  get:
 *      summary: Verifica que el Bloque exista, y la devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Block]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del Bloque a buscar
 *      responses:
 *          200: 
 *              description: Devuelve un Bloque
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
 *                                  $ref: '#/components/schemas/Block'
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

api.put('/:id', Block.updateBlock)

/**
 * @swagger
 * /api/block/{id}:
 *  put:
 *      summary: Edita un bloque, y retorna los datos actualizados
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Block]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del bloque a editar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre del bloque.
 *                      example: General
 *                    number:
 *                      type: number
 *                      description: número asociado al bloque.
 *                      example: 1
 *      responses:
 *          200: 
 *              description: Edita un bloque
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
 *                                  example: the block has been updated successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Block'
 *          400: 
 *              description: invalid name / invalid number
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
 *                                  example: invalid name
 *                              detail: 
 *                                  type: string
 *                                  example: name is an obligatory field
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

api.delete('/:id', Block.deleteBlock)

/**
 * @swagger
 * /api/block/{id}:
 *  delete:
 *      summary: Elimina un bloque, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Block]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del bloque a eliminar
 *      responses:
 *          200: 
 *              description: Elimina un bloque, y devuelve sus datos
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
 *                                  example: the block has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Block'
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