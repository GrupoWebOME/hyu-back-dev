const express = require('express')
const api = express.Router()
const Audit = require('../../controllers/audit/audit_controller')
const authenticationAdmin = require('../../middlewares/authenticationAdmin')

/**
 * @swagger
 * components:
 *  schemas:
 *      Audit:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id de la auditoría
 *              name:
 *                  type: string
 *                  description: nombre de la auditoría
 *              installation_type:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificador del tipo de instalación 
 *              criterions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      criterion:
 *                        type: string
 *                        description: identificador del criterio
 *                      exceptions:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: identificador de la instalación
 *              installation_exceptions:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: identificador de la/s instalación/es exceptuadas para la auditoria completa
 *              isAgency:
 *                  type: boolean
 *                  description: Especifica si la auditoría afecta a instalaciones o agencias. Si es true, afecta agencias. Si es false, afecta a instalaciones
 *              initial_date:
 *                  type: date
 *                  description: Fecha de inicio.
 *              end_date:
 *                  type: date
 *                  description: Fecha de fin.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del bloque
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - name
 *              - installation_type
 *              - criterions
 *              - initial_date
 *              - end_date
 *              - isAgency
 *              - createdAt
 *              - updatedAt
 *          example:
 *              name: Audit 1
 *              installation_type: ['u32423423rewr2331']
 *              criterions: [{criterion: 21312rwqewqe984, exceptions: ['23123awea898432423', '3242304823498dea']}]
 *              initial_date: 2022-10-20
 *              end_date: 2022-10-22
 *              isAgency: false
 *              installation_exceptions: ['a324982389239wqdas898999']
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Audit
  *   description: Rutas de Auditorías
  */

api.post('/all', authenticationAdmin.validate, Audit.getAllAudit)

/**
 * @swagger
 * /api/audit/all:
 *  post:
 *      summary: Devuelve todas las auditorías por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Audit]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre de la auditoria.
 *                      example: Auditoria 1
 *                    installation_type:
 *                      type: string
 *                      description: identificador del tipo de instalación 
 *                      example: 625494cf52b66d16944982a9
 *                    initial_date:
 *                      type: date
 *                      description: 2021-10-20
 *                    end_date:
 *                      type: date
 *                      description: 2021-12-20
 *                    isAgency:
 *                      type: boolean
 *                      description: Especifica si la auditoría afecta a instalaciones o agencias. Si es true, afecta agencias. Si es false, afecta a instalaciones
 *                    pageReq:
 *                      type: number
 *                      description: Es el número de página, debe ser mayor a cero
 *                      example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todos las auditorías por paginación, y el total de páginas
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
 *                                           audits:
 *                                               $ref: '#/components/schemas/Audit'
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

api.post('/', authenticationAdmin.validate, Audit.createAudit)

/**
 * @swagger
 * /api/audit/:
 *  post:
 *      summary: Crea una nueva auditoría, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Audit]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                        type: string
 *                        description: Nombre de la auditoría.
 *                        example: Auditoría 1
 *                      installation_type:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: identificador del tipo de instalación
 *                          example: 625494cf52b66d16944982a9   
 *                      initial_date:
 *                         type: date
 *                         description: Fecha de inicio.
 *                         example: 2021-12-12
 *                      installation_exceptions:
 *                        type: array
 *                        items:
 *                             type: string
 *                             description: identificador de la/s instalación/es exceptuadas para la auditoria completa
 *                             example: 625494cf52b66d16944982a9
 *                      end_date:
 *                         type: date
 *                         description: Fecha de fin.
 *                         example: 2021-12-12
 *                      isAgency:
 *                         type: boolean
 *                         description: Especifica si la auditoría afecta a instalaciones o agencias. Si es true, afecta agencias. Si es false, afecta a instalaciones
 *                         example: false
 *                      criterions:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            criterion:
 *                              type: string
 *                              description: identificador del criterio
 *                            exceptions:
 *                              type: array
 *                              items:
 *                                type: string
 *                                description: identificador de la instalación
 *                        example: [{criterion: 62549aa14c4776196567046a, exceptions: ['6254b006b6c4ef7e4c60d195','6254abc3c976951909b9cfc0']}] 
 *                  required:
 *                    - name
 *      responses:
 *          201: 
 *              description: Crea una auditoría, y retorna sus datos
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
 *                                  example: the Audit has been created successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Audit'
 *          400: 
 *              description: invalid name / invalid installation_type/ invalid initial_date/ invalid end_date/ invalid criterions
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

api.get('/:id', authenticationAdmin.validate, Audit.getAudit)

/**
 * @swagger
 * /api/audit/{id}:
 *  get:
 *      summary: Verifica que la auditoría exista, y la devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Audit]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la auditoría a buscar
 *      responses:
 *          200: 
 *              description: Devuelve una auditoría
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
 *                                  $ref: '#/components/schemas/Audit'
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

api.put('/:id', Audit.updateAudit)

/**
 * @swagger
 * /api/audit/{id}:
 *  put:
 *      summary: Edita una auditoría, y retorna los datos actualizados
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [Audit]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la auditoría a editar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                        type: string
 *                        description: Nombre de la auditoría.
 *                        example: Auditoría 1
 *                      installation_type:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: identificador del tipo de instalación
 *                          example: 625494cf52b66d16944982a9   
 *                      initial_date:
 *                         type: date
 *                         description: Fecha de inicio.
 *                         example: 12-12-2021
 *                      end_date:
 *                         type: date
 *                         description: Fecha de fin.
 *                         example: 12-12-2021
 *                      installation_exceptions:
 *                        type: array
 *                        items:
 *                             type: string
 *                             description: identificador de la/s instalación/es exceptuadas para la auditoria completa
 *                             example: 625494cf52b66d16944982a9
 *                      criterions:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            criterion:
 *                              type: string
 *                              description: identificador del criterio
 *                            exceptions:
 *                              type: array
 *                              items:
 *                                type: string
 *                                description: identificador de la instalación
 *                                example: [{criterion: 62549aa14c4776196567046a, exceptions: ['6254b006b6c4ef7e4c60d195','6254abc3c976951909b9cfc0']}] 
 *      responses:
 *          200: 
 *              description: Edita una auditoría, y retorna los datos actualizados
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
 *                                  example: the audit has been updated successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Audit'
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

api.delete('/:id', authenticationAdmin.validate, Audit.deleteAudit)

/**
 * @swagger
 * /api/audit/{id}:
 *  delete:
 *      summary: Elimina una auditoría, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Audit]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id de la auditoría a eliminar
 *      responses:
 *          200: 
 *              description: Elimina una auditoría, y devuelve sus datos
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
 *                                  example: the audit has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Audit'
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

api.get('/byupdate/:totalResults', authenticationAdmin.validate, Audit.getAllUpdateAudit)

/**
  * @swagger
  * /api/audit/byupdate/{totalResults}:
  *  get:
  *      summary: Devuelve la cantidad especificada de auditorías ordenadas por última fecha de modificación.
  *      description: >
  *        <b>Permissions</b> <br>
  *        - Requiere permisos de admin
  *      tags: [Audit]
  *      parameters:
  *          - in: path
  *            name: totalResults
  *            schema:
  *              type: string
  *              nullable: false
  *            required: true
  *            description: cantidad de resultados deseados
  *      responses:
  *          200: 
  *              description: Devuelve todos las auditorías por paginación, y el total de páginas
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
  *                                           audits:
  *                                               $ref: '#/components/schemas/Audit'
  *                                           totalPages: 
  *                                               type: integer
  *                                               example: 2
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
