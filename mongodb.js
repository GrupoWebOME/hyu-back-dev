//CommonJS
const mongoose = require('mongoose')
const dotenv = require('dotenv')

//Connection
dotenv.config() 

const URI = process.env.MONGOOSE_URI
  ? process.env.MONGOOSE_URI
  : 'mongodb://localhost'

if(mongoose.STATES[mongoose.connection.readyState] !== 'connected'){
  mongoose.connect(URI, { useNewUrlParser: true, 
    useUnifiedTopology: true})
    .then(() => console.log('BD conectada'))
    .catch(err => console.error(err))
} else {
  mongoose.connection.on('open', () => {
    console.log('[ MONGOOSE] Connected with poolSize')
  })
}