const express = require('express')
const api = express.Router()

const uploadImage = require('../../middlewares/uploadImage')
const cloudinary = require('../../controllers/cloudinary/cloudinary_controller')

api.post('/', uploadImage, cloudinary.uploadAvatar)

/**
  * @swagger
  * tags:
  *   name: Cloudinary
  *   description: Rutas de Cloudinary
  */

/**
 * @swagger
 * /api/cloudinary:
 *  post:
 *      summary: Sube y retorna la url de la imagen. 
 *      description: >
 *        <b>Permissions</b> <br>
 *        -
 *      tags: [Cloudinary]
 *      requestBody:
 *          content:
 *            multipart/form-data:
 *              schema:
 *                  type: object
 *                  properties:
 *                      image:   
 *                          type: string
 *                          format: binary
 *      responses:
 *          200: 
 *              description: Retorna un booleano
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              url:
 *                                  type: string
 *                                  example: www.img.jpg
 *          400: 
 *              description: invalid format
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
 *                                  example: invalid format
 *                              detail: 
 *                                  type: string
 *                                  example: invalid format
 */

module.exports = api