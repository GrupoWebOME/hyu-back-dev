const express = require('express')
const api = express.Router()
const Criterion = require('../../controllers/criterion/criterion_controller')
const authenticationAdminMain = require('../../middlewares/authenticationAdminMain')

/**
 * @swagger
 * components:
 *  schemas:
 *      Criterion:
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
 *              area:
 *                  type: string
 *                  description: identificador del área.
 *              installationType:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: identificador del tipo de instalación.
 *              standard:
 *                  type: string
 *                  description: identificador del standard.
 *              block:
 *                  type: string
 *                  description: identificador del bloque.
 *              auditResponsable:
 *                  type: string
 *                  description: identificador del auditor responsable.
 *              criterionType:
 *                  type: string
 *                  description: identificador del tipo de criterio.
 *              category:
 *                  type: string
 *                  description: identificador de la categoría.
 *              isHmeAudit:
 *                  type: boolean
 *                  description: Define si es auditoría hme.
 *              hmeCode:
 *                  type: string
 *                  description: Código hme.
 *              isImgAudit:
 *                  type: boolean
 *                  description: Define si es auditoría con imágen.
 *              imageUrl:
 *                  type: string
 *                  description: URL de la imágen.
 *              imageComment:
 *                  type: string
 *                  description: comentario de la imágen.
 *              isElectricAudit:
 *                  type: boolean
 *                  description: Define si es auditoría para automóviles eléctricos?.
 *              photo:
 *                  type: boolean
 *                  description: Define si es con foto (es redundante).
 *              saleCriterion:
 *                  type: boolean
 *                  description: Define si es un criterio de venta.
 *              hmesComment:
 *                  type: string
 *                  description: Comentario hmes.
 *              createdAt:
 *                  type: date
 *                  description: fecha de creación del área.
 *              updatedAt:
 *                  type: date
 *                  description: fecha de la última modificación
 *          required:
 *              - id
 *              - description
 *              - number
 *              - value
 *              - comment
 *              - installationType
 *              - standard
 *              - block
 *              - area
 *              - auditResponsable
 *              - criterionType
 *              - isAgency
 *              - isException
 *              - exceptions
 *              - isHmeAudit
 *              - hmeCode
 *              - isImgAudit
 *              - imageUrl
 *              - imageComment
 *              - isElectricAudit
 *              - photo
 *              - saleCriterion
 *              - hmesComment
 *              - createdAt
 *              - updatedAt
 *          example:
 *              id: 61796ab01c4a2a001602ab4e6
 *              description: Descripción del standard
 *              value: 12
 *              number: 1
 *              comment: comentario
 *              installationType: 21423234234234
 *              standard: 23453123123123
 *              block: 3126486534523234
 *              area: 122342353512
 *              auditResponsable: 61796ab01c4a2a001602ab4e1
 *              criterionType: a1749cc01c4a2fff1633ab3e
 *              isAgency: false
 *              isException: true
 *              isHmeAudit: false
 *              imageUrl: https://image.jpg
 *              imageComment: comentario imagen
 *              isElectricAudit: false
 *              photo: true
 *              saleCriterion: false
 *              hmesComment: comentarios hmes
 *              createdAt: 2021-10-20
 *              updatedAt: 2021-10-20
 */

/**
  * @swagger
  * tags:
  *   name: Criterion
  *   description: Rutas de Criterios
  */

api.post('/all', authenticationAdminMain.validate, Criterion.getAllCriterion)

api.post('/filter', authenticationAdminMain.validate, Criterion.filtersCriterions)

api.post('/calculates', authenticationAdminMain.validate, Criterion.calculates)

api.post('/filterByAudit', authenticationAdminMain.validate, Criterion.filtersAuditCriterions)

/**
 * @swagger
 * /api/criterion/all:
 *  post:
 *      summary: Devuelve todos los criterios por filtros y por paginación, y el total de páginas. Si page es igual a cero, devuelve todas por filtros
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Criterion]
 *      requestBody:
 *          required: true
 *          content:    
 *           application/json:
 *            schema:
 *             type: object
 *             properties: 
 *              pageReq:
 *                  type: number
 *                  description: número de página
 *                  example: 1
 *              description:
 *                  type: string
 *                  description: descripción del criterio
 *                  example: descripción criterio
 *              value:
 *                  type: number
 *                  description: valor del criterio
 *                  example: descripción criterio
 *              number:
 *                  type: number
 *                  description: número del criterio
 *                  example: 1
 *              isException:
 *                  type: boolean
 *                  description: Informa si el criterio es permeable a excepciones.
 *                  example: false
 *              comment:
 *                  type: string
 *                  description: comentario del standard
 *                  example: comentario
 *              isCore:
 *                  type: boolean
 *                  description: Define si es core o no.
 *                  example: false
 *              isAgency:
 *                  type: boolean
 *                  description: Define si es core o no.
 *                  example: false
 *              criterions:
 *                  type: array
 *                  items:
 *                    type: string
 *                    description: identificadores de criterios.
 *                  example: [ada0sd98898320423, 324823094239dsa]
 *              installationType:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: identificador del tipo de instalación.
 *                  example: 625494cf52b66d16944982a9
 *              standard:
 *                  type: string
 *                  description: identificador del standard.
 *                  example: 62548a7dc7401d4476a45821
 *              auditResponsable:
 *                  type: string
 *                  description: identificador del auditor responsable.
 *                  example: 625491541658be4a88b710e5
 *              criterionType:
 *                  type: string
 *                  description: identificador del tipo de criterio.
 *                  example: 625492a5092abf713c40e0ac
 *              category:
 *                  type: string
 *                  description: identificador de la categoría.
 *                  example: 6254751b846943289539dfef
 *              isHmeAudit:
 *                  type: boolean
 *                  description: Define si es auditoría hme.
 *                  example: 9324902349023
 *              hmeCode:
 *                  type: string
 *                  description: Código hme.
 *                  example: 903249082349
 *              isImgAudit:
 *                  type: boolean
 *                  description: Define si es auditoría con imágen.
 *                  example: false
 *              imageUrl:
 *                  type: string
 *                  description: URL de la imágen.
 *                  example: image.jpg
 *              imageComment:
 *                  type: string
 *                  description: comentario de la imágen.
 *                  example: imagen comentario
 *              isElectricAudit:
 *                  type: boolean
 *                  description: Define si es auditoría para automóviles eléctricos?.
 *                  example: false
 *              photo:
 *                  type: boolean
 *                  description: Define si es con foto (es redundante).
 *                  example: false
 *              saleCriterion:
 *                  type: boolean
 *                  description: Define si es un criterio de venta.
 *              hmesComment:
 *                  type: string
 *                  description: Comentario hmes.
 *                  example: comentario hemes
 *      responses:
 *          200: 
 *              description: Devuelve todas los criterios por paginación, y el total de páginas
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
 *                                           criterions:
 *                                               $ref: '#/components/schemas/Criterion'
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

api.post('/', authenticationAdminMain.validate, Criterion.createCriterion)

/**
 * @swagger
 * /api/criterion/:
 *  post:
 *      summary: Crea un criterio
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Criterion]
 *      requestBody: 
 *          required: true
 *          content:    
 *           application/json:
 *            schema:
 *             type: object
 *             properties: 
 *              description:
 *                  type: string
 *                  description: descripción del criterio
 *                  example: Criterion
 *              value:
 *                  type: number
 *                  description: valor del criterio
 *                  example: 1
 *              number:
 *                  type: number
 *                  description: número del criterio
 *                  example: 1
 *              isException:
 *                  type: boolean
 *                  description: Informa si el criterio es permeable a excepciones.
 *                  example: false
 *              comment:
 *                  type: string
 *                  description: comentario del standard
 *                  example: comentario
 *              isCore:
 *                  type: boolean
 *                  description: Define si es core o no.
 *                  example: false
 *              isAgency:
 *                  type: boolean
 *                  description: Define si es core o no.
 *                  example: false
 *              installationType:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: identificador del tipo de instalación.
 *                  example: ["625494cf52b66d16944982a9"]
 *              standard:
 *                  type: string
 *                  description: identificador del standard.
 *                  example: 62548a7dc7401d4476a45821
 *              auditResponsable:
 *                  type: string
 *                  description: identificador del auditor responsable.
 *                  example: 625491541658be4a88b710e5
 *              criterionType:
 *                  type: string
 *                  description: identificador del tipo de criterio.
 *                  example: 625492a5092abf713c40e0ac
 *              category:
 *                  type: string
 *                  description: identificador de la categoría.
 *                  example: 62547534846943289539dff4
 *              isHmeAudit:
 *                  type: boolean
 *                  description: Define si es auditoría hme.
 *                  example: false
 *              hmeCode:
 *                  type: string
 *                  description: Código hme.
 *                  example: null
 *              isImgAudit:
 *                  type: boolean
 *                  description: Define si es auditoría con imágen.
 *                  example: false
 *              imageUrl:
 *                  type: string
 *                  description: URL de la imágen.
 *                  example: image.jpg
 *              imageComment:
 *                  type: string
 *                  description: comentario de la imágen.
 *                  example: imagen comentario
 *              isElectricAudit:
 *                  type: boolean
 *                  description: Define si es auditoría para automóviles eléctricos?.
 *                  example: false
 *              photo:
 *                  type: boolean
 *                  description: Define si es con foto (es redundante).
 *                  example: false
 *              saleCriterion:
 *                  type: boolean
 *                  description: Define si es un criterio de venta.
 *                  example: false
 *              hmesComment:
 *                  type: string
 *                  description: Comentario hmes.
 *                  example: comentario hemes
 *      responses:
 *          201: 
 *              description: Crea un criterio, y lo retorna
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
 *                                  $ref: '#/components/schemas/Criterion'
 *          400:
 *              description: invalid description/ invalid value/ invalid number/ invalid isException/ invalid comment/ invalid isCore/ invalid isAgency/ invalid installationType/ invalid criterionType/ invalid hmesComment/ invalid saleCriterion/ invalid photo/ invalid isElectricAudit/ invalid isImgAudit/ invalid isHmeAudit/ invalid imageUrl/ invalid imageComment/ invalid hmeCode 
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
 *                                  example: number should be a positive integer
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

api.get('/:id', authenticationAdminMain.validate, Criterion.getCriterion)

/**
 * @swagger
 * /api/criterion/{id}:
 *  get:
 *      summary: Verifica que el criterio exista, y lo devuelve
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de administrador
 *      tags: [Criterion]
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
 *              description: Devuelve un Criterio
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
 *                                  $ref: '#/components/schemas/Criterion'
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

api.put('/:id', authenticationAdminMain.validate, Criterion.updateCriterion)

/**
 * @swagger
 * /api/criterion/{id}:
 *  put:
 *      summary: Edita un criterio, y retorna sus datos actualizados
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Criterion]
 *      parameters:
 *          - in: path
 *            name: page
 *            schema:
 *              type: integer
 *              minimun: 0
 *              nullable: false
 *            required: true
 *            description: identificador del criterio a editar
 *      requestBody:
 *          required: true
 *          content:    
 *           application/json:
 *            schema:
 *             type: object
 *             properties: 
 *              description:
 *                  type: string
 *                  description: descripción del criterio
 *                  example: descripción criterio
 *              value:
 *                  type: number
 *                  description: valor del criterio
 *                  example: descripción criterio
 *              number:
 *                  type: number
 *                  description: número del criterio
 *                  example: 1
 *              isException:
 *                  type: boolean
 *                  description: Informa si el criterio es permeable a excepciones.
 *                  example: false
 *              comment:
 *                  type: string
 *                  description: comentario del standard
 *                  example: comentario
 *              installationType:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: identificador del tipo de instalación.
 *                  example: ["625494cf52b66d16944982a9"]
 *              standard:
 *                  type: string
 *                  description: identificador del standard.
 *                  example: 62548a7dc7401d4476a45821
 *              auditResponsable:
 *                  type: string
 *                  description: identificador del auditor responsable.
 *                  example: 625491541658be4a88b710e5
 *              criterionType:
 *                  type: string
 *                  description: identificador del tipo de criterio.
 *                  example: 625492a5092abf713c40e0ac
 *              isHmeAudit:
 *                  type: boolean
 *                  description: Define si es auditoría hme.
 *                  example: false
 *              hmeCode:
 *                  type: string
 *                  description: Código hme.
 *                  example: 903249082349
 *              isImgAudit:
 *                  type: boolean
 *                  description: Define si es auditoría con imágen.
 *                  example: false
 *              imageUrl:
 *                  type: string
 *                  description: URL de la imágen.
 *                  example: image.jpg
 *              imageComment:
 *                  type: string
 *                  description: comentario de la imágen.
 *                  example: imagen comentario
 *              isElectricAudit:
 *                  type: boolean
 *                  description: Define si es auditoría para automóviles eléctricos?.
 *                  example: false
 *              photo:
 *                  type: boolean
 *                  description: Define si es con foto (es redundante).
 *                  example: false
 *              saleCriterion:
 *                  type: boolean
 *                  description: Define si es un criterio de venta.
 *                  example: false
 *              hmesComment:
 *                  type: string
 *                  description: Comentario hmes.
 *                  example: comentario hemes
 *      responses:
 *          200: 
 *              description: Edita un criterio, y retorna sus datos actualizados
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
 *                                  $ref: '#/components/schemas/Criterion'
 *          400: 
 *              description: invalid id/ invalid description/ invalid value/ invalid number/ invalid isException/ invalid comment/ invalid isCore/ invalid isAgency/ invalid installationType/ invalid criterionType/ invalid hmesComment/ invalid saleCriterion/ invalid photo/ invalid isElectricAudit/ invalid isImgAudit/ invalid isHmeAudit/ invalid imageUrl/ invalid imageComment/ invalid hmeCode 
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
 *                                  example: id should be a objectid
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

api.delete('/:id', authenticationAdminMain.validate, Criterion.deleteCriterion)

/**
 * @swagger
 * /api/criterion/{id}:
 *  delete:
 *      summary: Elimina un criterio, y devuelve sus datos
 *      description: >
 *        <b>Permissions</b> <br>
 *        - Requiere permisos de admin
 *      tags: [Criterion]
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
 *              description: Elimina un criterio, y devuelve sus datos
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
 *                                  example: the criterion has been deleted successfully
 *                              data:
 *                                  $ref: '#/components/schemas/Criterion'
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
