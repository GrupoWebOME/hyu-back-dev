const express = require('express')
const apiAdmin = express.Router()
const Admin = require('../../controllers/admin/admin_controller')
const authenticationAdminMain = require('../../middlewares/authenticationAdminMain')

/**
 * @swagger
 * components:
 *  schemas:
 *      Admin:
 *          type: object
 *          properties: 
 *              id:
 *                  type: string
 *                  description: Id del admin
 *              emailAdress:
 *                  type: string
 *                  description: email del admin
 *              password:
 *                  type: string
 *                  description: password del admin
 *              names:
 *                  type: string
 *                  description: nombre del admin
 *              surnames:
 *                  type: string
 *                  description: apellidos del admin
 *              userName:
 *                  type: string
 *                  description: username del admin
 *              isMain:
 *                  type: boolean
 *                  description: Si es true, implica que el admin es main
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del admin
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - id
 *              - emailAdress
 *              - userName
 *              - password
 *              - names
 *              - surnames
 *              - isMain
 *              - createdAt
 *              - updatedAt
 *          example:
 *              id: 61799ab01c4a2a001602ab4e
 *              emailAdress: anibal@gmail.com
 *              password: 1234$Asd
 *              names: anibal
 *              surname: gomez
 *              userName: anibalgomez91
 *              isMain: false
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Admin
  *   description: Rutas de admins
  */

apiAdmin.post('/all', authenticationAdminMain.validate, Admin.getAllAdmins)

/**
 * @swagger
 * /api/admin/all/:
 *  post:
 *      summary: Devuelve todos los administradores por paginación, y el total de páginas. Si page es igual a cero, devuelve todos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de adminMain
 *      tags: [Admin]
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
 *                    names:
 *                      type: string
 *                      description: Nombres del administrador.
 *                      example: Gregorio
 *                    surnames:
 *                      type: string
 *                      description: Apellidos del administrador
 *                      example: Perez
 *                    emailAddress:
 *                      type: string
 *                      description: correo del administrador.
 *                      example: gregoriolopez@gmail.com
 *                    userName:
 *                      type: string
 *                      description: Nombre de usuario del administrador.
 *                      example: gregoriolopez
 *                    pageReq:
 *                      type: number
 *                      description: Es el número de página, debe ser mayor a cero
 *                      example: 1
 *      responses:
 *          200: 
 *              description: Devuelve todos los administradores por paginación, y el total de páginas
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
 *                                           admins:
 *                                               $ref: '#/components/schemas/Admin'
 *                                           totalPages: 
 *                                               type: integer
 *                                               example: 1
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

apiAdmin.get('/:id', Admin.getAdmin)

/**
 * @swagger
 * /api/admin/{id}:
 *  get:
 *      summary: Verifica que el administrador exista, y lo devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador(que se corresponde con la id), o de adminMain
 *      tags: [Admin]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del administrador a buscar
 *      responses:
 *          200: 
 *              description: Devuelve un administrador
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
 *                                  $ref: '#/components/schemas/Admin'
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

apiAdmin.put('/:id', authenticationAdminMain.validate, Admin.updateAdmin)

/**
 * @swagger
 * /api/admin/{id}:
 *  put:
 *      summary: Edita un administrador
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador main, o debe tener permisos de admin y modificarse solamente a sí mismo.<br><br>
 *        <b>Regexp</b> <br>
 *        - Regexp names, and surnames: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u <br>
 *        - Regexp emailAddress: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ <br>
 *        - Regexp username: /^(?=[a-zA-Z0-9._\u00f1\u00d1]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/ <br>
 *      tags: [Admin]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del administrador a editar
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    names:
 *                      type: string
 *                      description: Nombres del administrador.
 *                      example: Alfonso
 *                    surnames:
 *                      type: string
 *                      description: Apellidos del administrador.
 *                      example: Garbarino
 *                    emailAddress:
 *                      type: string
 *                      description: Email del administrador.
 *                      example: alfonsogarbarino@gmail.com
 *                    userName:
 *                      type: string
 *                      description: username del administrador.
 *                      example: alfonsogarbarino
 *                    password:
 *                      type: string
 *                      description: Password del administrador.
 *                      example: 1234$Asd
 *      responses:
 *          201: 
 *              description: Crea un administrador
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
 *                                  example: the administrator has been edited successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Admin'
 *          400: 
 *              description: invalid id / invalid names / invalid surnames / invalid emailAddress/ invalid password / invalid userName 
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

apiAdmin.delete('/:id', authenticationAdminMain.validate, Admin.deleteAdmin)

/**
 * @swagger
 * /api/admin/{id}:
 *  delete:
 *      summary: Elimina un administrador, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin main
 *      tags: [Admin]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              nullable: false
 *            required: true
 *            description: id del administrador a eliminar
 *      responses:
 *          200: 
 *              description: Elimina un administrador, y devuelve sus datos
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
 *                                  example: the administrator has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Admin'
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

apiAdmin.post('/login', Admin.loginAdmin)

/**
 * @swagger
 * /api/admin/login/:
 *  post:
 *      summary: Verifica que el administrador exista, y lo devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        -
 *      tags: [Admin]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    user:
 *                      type: string
 *                      description: username o emailAddress del administrador.
 *                      example: alfonsogarbarino
 *                    password:
 *                      type: string
 *                      description: Password del administrador.
 *                      example: 1234$Asd
 *      responses:
 *          200: 
 *              description: Loguea un administrador
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
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                    admin:
 *                                      $ref: '#/components/schemas/Admin'
 *                                    token:
 *                                      type: string
 *                                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJfaWQiOiI2MjUwZDYwMTMwYjdkYTAzZWRjNzQyMTkiLCJuYW1lcyI6ImFsZm9uc28iLCJzdXJuYW1lcyI6ImdhcmJhcmlubyIsImVtYWlsQWRkcmVzcyI6ImFsZm9uc29nYXJiYXJpbm9AZ21haWwuY29tIiwidXNlck5hbWUiOiJhbGZvbnNvZ2FyYmFyaW5vIiwicGFzc3dvcmQiOiIkMmIkMTAkeUVZaFpoRTl4bG5TMmhaYm1ZdTluLm1WUUlBUC40Z1ZSS05IVXg0Mjk3SlZjQzZPZFNRQWkiLCJpc01haW4iOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDIyLTA0LTA5VDAwOjQwOjMzLjM1MloiLCJ1cGRhdGVkQXQiOiIyMDIyLTA0LTA5VDAwOjQwOjMzLjM1MloiLCJfX3YiOjB9LCJpYXQiOjE2NDk0NjcwMzcsImV4cCI6MTY0OTU1MzQzN30.i2sy8rmP1sXLAW2zhZ1dXCAFDZ37p9inDCm8XUY6gjU
 *          401: 
 *              description: invalid credentials
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

apiAdmin.post('/', authenticationAdminMain.validate, Admin.createAdmin)

/**
 * @swagger
 * /api/admin/:
 *  post:
 *      summary: Crea un nuevo administrador
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador main <br><br>
 *        <b>Regexp</b> <br>
 *        - Regexp names, and surnames: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u <br>
 *        - Regexp emailAddress: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ <br>
 *        - Regexp username: /^(?=[a-zA-Z0-9._\u00f1\u00d1]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/     <br>
 *      tags: [Admin]
 *      requestBody:
 *          required: true
 *          content:    
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    names:
 *                      type: string
 *                      description: Nombres del administrador.
 *                      example: Alfonso
 *                    surnames:
 *                      type: string
 *                      description: Apellidos del administrador.
 *                      example: Garbarino
 *                    emailAddress:
 *                      type: string
 *                      description: Email del administrador.
 *                      example: alfonsogarbarino@gmail.com
 *                    userName:
 *                      type: string
 *                      description: username del administrador.
 *                      example: alfonsogarbarino
 *                    password:
 *                      type: string
 *                      description: Password del administrador.
 *                      example: 1234$Asd
 *                  required:
 *                    - names
 *                    - surnames
 *                    - emailAddress
 *                    - password
 *                    - userName
 *      responses:
 *          201: 
 *              description: Crea un administrador
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
 *                                  example: the administrator has been created successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Admin'
 *          400: 
 *              description: invalid names / invalid surnames / invalid emailAddress/ invalid password / invalid isMain / invalid userName 
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

 module.exports = apiAdmin