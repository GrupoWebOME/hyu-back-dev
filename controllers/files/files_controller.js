const AWS = require('aws-sdk')
const axios = require('axios')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "eu-central-1"
})

const upload = { 
   
    uploadImage: (req, res) => {
        const folderName = req?.body?.folderName || 'OTHERS';
        const file = req.files.file;
        const fileType = file.mimetype.split('/')[1];
        const name =  req?.body?.fileName || `${Date.now()}`;
        const fileName = `${name}.${fileType}`;
        try {
            const s3 = new AWS.S3()
            const fileContent = Buffer.from(req.files.file.data, 'binary')
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `uploads/${folderName}/${fileName}`,
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

    migrationImage: async (req, res) => {
        const { folderName, url } = req.body
        console.log('folderName',folderName)
        console.log(url)
        try {
            axios.get(url, { responseType: 'arraybuffer' }).then((response) => {
                console.log('response', response)
                if (!response?.data) {
                    throw err
                }
                const fileContent = Buffer.from(response.data, 'binary');
                const s3 = new AWS.S3()
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: folderName,
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

            }).catch(error => {
                console.error(error);
                res.status(500).send('Error uploading to S3');
              });
   
        }
        catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = upload
