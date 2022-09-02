const jwt = require('jsonwebtoken')

const validate = async(request, response, next) => {

    const {authorization} = request.headers

    if(!authorization)
        return response.status(401).json({code: 401,
                                          msg: 'invalid credentials',
                                          detail: 'you do not have permissions'})

    let decodedToken = null

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
    }

    await jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err){
            decodedToken = false
        }
        else{
            decodedToken = decoded
        }
    })

    if(decodedToken === false)
        return response.status(401).json({code: 401,
                                          msg: 'invalid credentials',
                                          detail: 'you do not have permissions'})
    
    request.jwt = decodedToken

    next()
}

module.exports = {validate}
