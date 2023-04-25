//CommonJS
const mongoose = require('mongoose')
const dotenv = require('dotenv')

//Connection
dotenv.config() 

const URI = process.env.MONGOOSE_URI
  ? process.env.MONGOOSE_URI
  : 'mongodb://localhost'

let db

if(mongoose.STATES[mongoose.connection.readyState] !== 'connected'){
  db = mongoose.connect(URI, { useNewUrlParser: true, 
    useUnifiedTopology: true})
    .then(db => console.log('BD conectada'))
    .catch(err => console.error(err))
} else {
  db = mongoose.connection.on('open', () => {
    console.log('[ MONGOOSE] Connected with poolSize')
  })
}