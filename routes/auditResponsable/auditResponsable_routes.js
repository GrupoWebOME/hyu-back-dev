const express = require('express')
const api = express.Router()
const AuditResponsable = require('../../controllers/auditResponsable/auditResponsable_controller')
const authenticationAdminMain = require('../../middlewares/authenticationAdminMain')

/**
 * @swagger
 * components:
 *  schemas:
 *      AuditResponsable:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id del área
 *              name:
 *                  type: string
 *                  description: nombre del área
 *              idSecondary:
 *                  type: string
 *                  description: identificador secundario
 *              criterions:
 *                  type: array
 *                  items:
 *                    type: string
 *                  description: identificadores de criterios.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del área.
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - id
 *              - name
 *              - criterions
 *              - idSecondary
 *              - createdAt
 *              - updatedAt
 *          example:
 *              id: 61799ab01c4a2a001602ac4e
 *              idSecondary: 3
 *              name: AuditResponsable name
 *              criterions: [61799ab01c4a2a001602ab4e]
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: AuditResponsable
  *   description: Rutas de Responsables de audiciones
  */

api.post('/all', authenticationAdminMain.validate, AuditResponsable.getAllAuditResponsable)

/**
 * @swagger
 * /api/auditresponsable/all:
 *  post:
 *      summary: Devuelve todas los auditores responsable. por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [AuditResponsable]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre de auditor responsable.
 *                      example: Auditor
 *                    idSecondary:
 *                      type: string
 *                      description: Nombre de auditor responsable..
 *                      example: Auditor
 *                    pageReq:
 *                      type: number
 *                      description: Es el número de página, debe ser mayor a cero
 *                      example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todas los auditores responsables por paginación, y el total de páginas
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
 *                                           auditResponsables:
 *                                               $ref: '#/components/schemas/AuditResponsable'
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

api.post('/', authenticationAdminMain.validate, AuditResponsable.createAuditResponsable)

/**
 * @swagger
 * /api/auditresponsable/:
 *  post:
 *      summary: Crea un auditor responsable, y retorna sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [AuditResponsable]
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
 *                      example: Auditor
 *                    idSecondary:
 *                      type: string
 *                      description: Nombre del área.
 *                      example: Auditor
 *      responses:
 *          201: 
 *              description: Crea y retorna un auditor responsable
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
 *                                  example: the auditor responsable has been created
 *                              data:
 *                                  $ref: '#/components/schemas/AuditResponsable'
 *          400: 
 *              description: invalid name/ invalid idsecondary
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
 *                                  example: invalid name
 *                              detail: 
 *                                  type: string
 *                                  example: name is a obligatory field
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

api.get('/:id', authenticationAdminMain.validate, AuditResponsable.getAuditResponsable)

/**
 * @swagger
 * /api/auditresponsable/{id}:
 *  get:
 *      summary: Verifica que el auditor responsable exista, y lo devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [AuditResponsable]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del auditor reponsable a buscar
 *      responses:
 *          200: 
 *              description: Retorna un auditor responsable
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
 *                                  $ref: '#/components/schemas/AuditResponsable'
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

api.put('/:id', authenticationAdminMain.validate, AuditResponsable.updateAuditResponsable)

/**
 * @swagger
 * /api/auditresponsable/{id}:
 *  put:
 *      summary: Setea a un auditor responsable, y retorna sus datos actualizados
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [AuditResponsable]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del auditor responsable a buscar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Nombre de auditor responsable.
 *                      example: Auditor
 *                    idSecondary:
 *                      type: string
 *                      description: Nombre de auditor responsable.
 *                      example: 123
 *      responses:
 *          200: 
 *              description: Setea a un auditor responsable y retorna sus datos actualizados
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
 *                                  example: the AuditResponsable has been updated successfully
 *                              data:
 *                                  $ref: '#/components/schemas/AuditResponsable'
 *          400: 
 *              description: invalid id/ invalid name/ invalid idSecondary
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

api.delete('/:id', authenticationAdminMain.validate, AuditResponsable.deleteAuditResponsable)

/**
 * @swagger
 * /api/auditresponsable/{id}:
 *  delete:
 *      summary: Elimina un auditor responsable, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [AuditResponsable]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del auditor responsable a eliminar
 *      responses:
 *          200: 
 *              description: Elimina un auditor responsable, y devuelve sus datos
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
 *                                  example: the auditor responsbale has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/AuditResponsable'
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