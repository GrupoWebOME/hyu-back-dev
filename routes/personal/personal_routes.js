const express = require('express')
const api = express.Router()
const Personal = require('../../controllers/personal/personal_controller')

/**
 * @swagger
 * components:
 *  schemas:
 *      Personal:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id del personal
 *              id_secondary:
 *                  type: string
 *                  description: Id secundario del personal
 *              name_and_surname:
 *                  type: string
 *                  description: nombre y apellido del personal
 *              dni:
 *                  type: string
 *                  description: dni del personal
 *              installation:
 *                  type: string
 *                  description: instalación a la que pertenece el personal
 *              dealership:
 *                  type: string
 *                  description: agencia a la que pertenece el personal
 *              address:
 *                  type: string
 *                  description: dirección del personal
 *              role:
 *                  type: array
 *                  items:
 *                    type: string
 *                  description: identificadores del rol.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del área.
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - id
 *              - id_secondary
 *              - name_and_surname
 *              - dni
 *              - installation
 *              - dealership
 *              - address
 *              - role
 *              - createdAt
 *              - updatedAt
 *          example:
 *              id: 2138213890euwrwer8342
 *              id_secondary: 1
 *              name_and_surname: eduardo lopez
 *              dni: 34888999
 *              installation: 11799ab01c4a2a001602ab4e
 *              dealership: 13799ab01c4a2a001602ab4e
 *              address: pellegrini 2020
 *              role: 61799ab01c4a2a001602ab1z
 *              criterions: [61799ab01c4a2a001602ab4e]
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Personal
  *   description: Rutas de Personal
  */

api.post('/all', Personal.getAllPersonal)

/**
 * @swagger
 * /api/personal/all:
 *  post:
 *      summary: Devuelve todo el personal por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Personal]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name_and_surname:
 *                      type: string
 *                      description: Nombre y apellido
 *                      example: Auditor
 *                    dni:
 *                      type: string
 *                      description: Nombre del personal.
 *                      example: 3322113344
 *                    address:
 *                      type: string
 *                      description: dirección del personal.
 *                      example: pellegrini 2020
 *                    id_secondary:
 *                      type: string
 *                      description: dni del personal.
 *                      example: 3464
 *                    installation:
 *                      type: string
 *                      description: identificador de la installacion del personal.
 *                      example: 346464566ee23
 *                    dealership:
 *                      type: string
 *                      description: identificador de la dealership del personal.
 *                      example: 346464566ee23
 *                    pageReq:
 *                      type: number
 *                      description: Es el número de página, debe ser mayor a cero
 *                      example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todo el personal por paginación, y el total de páginas
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
 *                                           personals:
 *                                               $ref: '#/components/schemas/Personal'
 *                                           totalPages: 
 *                                               type: number
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

api.post('/', Personal.createPersonal)

/**
 * @swagger
 * /api/personal/:
 *  post:
 *      summary: Crea un tipo de criterio responsable
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Personal]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name_and_surname:
 *                      type: string
 *                      description: Nombre y apellido del personal.
 *                      example: nombre apellido
 *                    dni:
 *                      type: string
 *                      description: dni del personal.
 *                      example: 363423113
 *                    email:
 *                      type: string
 *                      description: email del personal.
 *                      example: nombreapellido@gmail.com
 *                    address:
 *                      type: string
 *                      description: dirección del personal.
 *                      example: Dirección 2200
 *                    id_secondary:
 *                      type: string
 *                      description: identificador secundario del personal.
 *                      example: 213123123
 *                    installation:
 *                      type: string
 *                      description: Nombre del personal.
 *                      example: 6254abc3c976951909b9cfc0
 *                    dealership:
 *                      type: string
 *                      description: installation a la que pertenece el personal.
 *                      example: 6254a537a25ee0d4c4e71bae
 *                    role:
 *                      type: array
 *                      items:
 *                          type: string
 *                          description: identificador del rol del personal.
 *                          example: 6254ad4e0b34927d3cad7edc
 *      responses:
 *          201: 
 *              description: Crea un personal
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
 *                                  $ref: '#/components/schemas/Personal'
 *          400: 
 *              description: invalid name_and_surname/ invalid dni/ invalid address/ invalid id_secondary/ invalid installation/ invalid dealership/ invalid role
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
 *                                  example: invalid role
 *                              detail: 
 *                                  type: string
 *                                  example: invalid role id
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

api.get('/:id', Personal.getPersonal)

/**
 * @swagger
 * /api/personal/{id}:
 *  get:
 *      summary: Verifica que el personal exista, y lo devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Personal]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del personal a buscar
 *      responses:
 *          200: 
 *              description: Devuelve un personal
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
 *                                  $ref: '#/components/schemas/Personal'
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

api.put('/:id', Personal.updatePersonal)

/**
 * @swagger
 * /api/personal/:
 *  put:
 *      summary: Edita un personal por i
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Personal]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del auditor reponsable a buscar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name_and_surname:
 *                      type: string
 *                      description: Nombre del área.
 *                      example: nombre apellido
 *                    dni:
 *                      type: string
 *                      description: Nombre del área.
 *                      example: 335566778
 *                    address:
 *                      type: string
 *                      description: Nombre del área.
 *                      example: Pellegrini 2020
 *                    id_secondary:
 *                      type: string
 *                      description: Nombre del área.
 *                      example: 123123123
 *                    installation:
 *                      type: string
 *                      description: Nombre del área.
 *                      example: 6254abc3c976951909b9cfc0
 *                    dealership:
 *                      type: string
 *                      description: Nombre del área.
 *                      example: 6254a537a25ee0d4c4e71bae
 *                    email:
 *                      type: string
 *                      description: email del personal.
 *                      example: nombreapellido@gmail.com
 *                    role:
 *                      type: array
 *                      items:
 *                          type: string
 *                          description: Nombre del área.
 *                          example: 6254ad4e0b34927d3cad7edc
 *      responses:
 *          200: 
 *              description: Crea un tipo de criterio
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
 *                                               $ref: '#/components/schemas/Personal'
 *                                           totalPage: 
 *                                               type: number
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

api.delete('/:id', Personal.deletePersonal)

/**
 * @swagger
 * /api/personal/{id}:
 *  delete:
 *      summary: Elimina un personal, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Personal]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del personal a eliminar
 *      responses:
 *          200: 
 *              description: Elimina un personal, y devuelve sus datos
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
 *                                  example: the auditor has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Personal'
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
