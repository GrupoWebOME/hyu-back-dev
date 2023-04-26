const express = require('express')
const api = express.Router()
const AuditResults = require('../../controllers/auditResults/auditResults_controller')

/**
 * @swagger
 * components:
 *  schemas:
 *      AuditResults:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id del resultado de la auditoría
 *              audit_id:
 *                  type: string
 *                  description: Identificador de la auditoría
 *              installation_id:
 *                  type: string
 *                  description: Identificador de la instalación
 *              dealership_id:
 *                  type: string
 *                  description: identificador de la Agencia
 *              criterions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      criterion_id:
 *                        type: string
 *                        description: identificador del criterio
 *                      pass:
 *                        type: boolean
 *                        description: Especifica si el criterio se ha cumplido o no.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del bloque
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - audit_id
 *              - installation_id
 *              - criterions
 *              - createdAt
 *              - updatedAt
 *          example:
 *              audit_id: Audit 1
 *              installation_id: 'u32423423rewr2331'
 *              criterions: [{criterion: 21312rwqewqe984, pass: false}]
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: AuditResults
  *   description: Rutas de Resultados de Auditorias
  */

api.post('/', AuditResults.createAuditResults)
api.post('/createTest', AuditResults.createAuditResultsTest)

/**
 * @swagger
 * /api/auditresults/:
 *  post:
 *      summary: Crea un nuevo resultado de auditoria, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [AuditResults]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: Identificador del resultado de la auditoria.
 *                      example: 21312454456wq42
 *                    audit_id:
 *                      type: string
 *                      description: identificador de la auditoria
 *                      example: 625494cf52b66d16944982a9
 *                    installation_id:
 *                      type: string
 *                      description: identificador de la instalación
 *                      example: 625494cf52b66d1694498211
 *                    dealership_id:
 *                      type: string
 *                      description: identificador de la Agencia
 *                      example: 625494cf52b66d1694498216
 *                    criterions:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          criterion_id:
 *                            type: string
 *                            description: identificador del criterio
 *                            example: 823480923498023490
 *                          pass:
 *                            type: boolean
 *                            description: Especifica si el criterio se ha cumplido o no.
 *                            example: true
 *                  required:
 *                    - name
 *      responses:
 *          201: 
 *              description: Crea un resultado de auditoria, y retorna sus datos
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
 *                                  example: the AuditResults has been created successfully
 *                              data:
 *                                  $ref: '#/components/schemas/AuditResults'
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

api.put('/:id', AuditResults.updateAuditResults)

/**
 * @swagger
 * /api/auditresults/{id}:
 *  put:
 *      summary: Edita una auditoría, y retorna los datos actualizados
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador <br>
 *      tags: [AuditResults]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del resultado de auditoria a editar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: Identificador del resultado de la auditoria.
 *                      example: 21312454456wq42
 *                    audit_id:
 *                      type: string
 *                      description: identificador de la auditoria
 *                      example: 625494cf52b66d16944982a9
 *                    dealership_id:
 *                      type: string
 *                      description: identificador de la Agencia
 *                      example: 625494cf52b66d1694498216
 *                    installation_id:
 *                      type: string
 *                      description: identificador de la instalación
 *                      example: 625494cf52b66d1694498211
 *                    criterions:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          criterion_id:
 *                            type: string
 *                            description: identificador del criterio
 *                            example: 823480923498023490
 *                          pass:
 *                            type: boolean
 *                            description: Especifica si el criterio se ha cumplido o no.
 *                            example: true
 *      responses:
 *          200: 
 *              description: Edita un resultado de auditoría, y retorna los datos actualizados
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
 *                                  example: the AuditResults has been updated successfully
 *                              data:
 *                                  $ref: '#/components/schemas/AuditResults'
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

api.delete('/:id', AuditResults.deleteAuditResults)

/**
 * @swagger
 * /api/auditresults/{id}:
 *  delete:
 *      summary: Elimina un resultado de auditoría, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [AuditResults]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del resultado de auditoría a eliminar
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
 *                                  example: the AuditResults has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/AuditResults'
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

api.post('/tables', AuditResults.getDataForTables)
api.post('/tables2', AuditResults.tablesTest)

api.put('/updatetest/:id', AuditResults.updateTest)

api.post('/tables/audit/:audit_id', AuditResults.getDataForAudit)

api.get('/tables/audit/:audit_id/details', AuditResults.getDataForFullAudit)

api.get('/tables/audit/:audit_id/details2', AuditResults.getDataForFullAuditTest)

api.get('/audit/:auditid/installation/:installationid', AuditResults.getAuditResByAuditIDAndInstallationID)

api.get('/audit/:auditid', AuditResults.getAuditResByAuditID)

module.exports = api
