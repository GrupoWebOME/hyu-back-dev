const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "eu-central-1"
})

const upload = { 
   
    uploadImage: (req, res) => {
        const folderName = req?.body?.folderName || 'OTHERS'
        try {
            const s3 = new AWS.S3()
            const fileContent = Buffer.from(req.files.image.data, 'binary')
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `uploads/${folderName}/${req.files.image.name}`,
                Body: fileContent,
              };              
            s3.upload(params, (err, data) => {
                if (err) {
                    throw err
                }
                res.send({
                    "code": 200,
                    "message": 'Success',
                    "data": data
                })
            })
        }
        catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = upload
