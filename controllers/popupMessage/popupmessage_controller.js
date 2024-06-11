/* eslint-disable no-useless-escape */
const PopUpMessage = require('../../models/popup_message_model')
const Admin = require('../../models/admin_model')
const ObjectId = require('mongodb').ObjectId
const nodemailer = require('nodemailer')

const validUsersArr = ['admin', 'dealership', 'processmanager', 'auditor', 'main']

const mailCreateBody = ({ message }) => { 
  return `
    <p>
      Estimado concesionario,
    </p> 
    <p>
      Se comunica la siguiente notificación:
    </p> 
    <div>${message}</div>
    <p>Esta información se encuentra accesible a través de la aplicación Hyundai Standards Application (HSA). 
       Para cualquier duda contactar con Elena Drandar: estandares-hyundai@redhyundai.com</p>
    <p>Recibe un cordial saludo,</p>
    <div style="margin-top: 1.2rem">
      <img src="https://res.cloudinary.com/hyundaiesp/image/upload/v1679065791/logos/hsa-firma-email_k3yldt.png" alt="hyundai firma" />
    </div>
`}

const sendMail = async(subject, content, recipients) => {    
  try{
    if(!process.env.EMAIL_SENDER || !process.env.EMAIL_PASSWORD){
      return
    }

    var transporter = nodemailer.createTransport({
      host: 'smtp.hornet.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
          
    var mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: recipients.join(', '),
      bcc: process.env.EMAIL_SENDER,
      subject: subject,
      html: content
    }
          
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('error: ', error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    return
  }
  catch(error){
    console.log('err: ', error)
  }
}

const createPopUp = async(request, response) => {
  try{
    const {name, message} = request.body
    let errors = []
        
    if(!name)
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'name is required'
      })  

    if (!validUsersArr.includes(name)) {
      errors.push({code: 400, 
        msg: 'invalid name',
        detail: 'name must be main, admin, dealership, processmanager or auditor'
      })  
    }

    if(name){
      const existName = await PopUpMessage.findOne({ name })
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error name',
          detail: error.message
        })} )  

      if(existName)
        return response.status(400).json({code: 400, 
          msg: 'invalid name',
          detail: 'name already exist'
        })
    }

    if(!message)
      errors.push({code: 400, 
        msg: 'invalid message',
        detail: 'message is required'
      })  

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const newPopUp = new PopUpMessage({
      name,
      message
    })

    await newPopUp.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const dealershipArray = await Admin.find({ role: name })

    let emailAddresses = []

    dealershipArray.forEach((element) => {
      if (element.emailAddress) {
        emailAddresses.push(element.emailAddress)
      }
      if (element.secondaryEmailAddress) {
        emailAddresses.push(element.secondaryEmailAddress)
      }
    })

    // await sendMail('Notificación HSA', mailCreateBody(message), emailAddresses)

    response.status(201).json({code: 201,
      msg: 'the popup message has been created successfully',
      data: newPopUp })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updatePopUp = async(request, response) => {
  try{
    const { id } = request.params
    const { message, active } = request.body

    let errors = []

    if(active !== null && active !== undefined && typeof active !== 'boolean')
      errors.push({code: 400, 
        msg: 'invalid active field',
        detail: 'active field is required'
      }) 
        
    if(id && ObjectId.isValid(id)){
      const existId = await PopUpMessage.findById(id)
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error id',
          detail: error.message
        })} )  

      if(!existId)
        return response.status(400).json({code: 400, 
          msg: 'invalid id',
          detail: 'id not found'
        })
    }
    else{
      return response.status(400).json({code: 400, 
        msg: 'invalid id',
        detail: 'id not found'
      })   
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const updatedFields = {}

    if(message)
      updatedFields['message'] = message
    
    if(active !== null && active !== undefined) {
      updatedFields['active'] = active
    }

    updatedFields['updatedAt'] = Date.now()

    const updatedPopUp = await PopUpMessage.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(201).json({code: 200,
      msg: 'the PopUp Message has been updated successfully',
      data: updatedPopUp })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getAllPopUp  = async(request, response) => {
  try{
    const { pageReq } = request.body

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(page === 0){
      const popup = await PopUpMessage.find(filter)
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
      const data = {
        popup, 
        totalPages: 1
      }

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await PopUpMessage.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const popup = await PopUpMessage.find(filter).skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const data = {
      popup, 
      totalPages: countPage
    }

    response.status(200).json({code: 200,
      msg: 'success',
      data: data })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
}

const getPopUp = async(request, response) => {
  try{
    const {id} = request.params

    if(!id)
      return response.status(400).json({code: 400,
        msg: 'invalid id',
        detail: 'id is a obligatory field'})
    
    if(id && !ObjectId.isValid(id))
      return response.status(400).json({code: 400,
        msg: 'invalid id',
        detail: 'id should be an objectId'})
    
    const popup = await PopUpMessage.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(popup){
      response.status(200).json({code: 200,
        msg: 'success',
        data: popup})
    }
    else{
      response.status(200).json({code: 204,
        msg: 'not found',
        data: null})}
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
  }  
}

const deletePopUp = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await PopUpMessage.exists({_id: id})
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error id',
          detail: error.message
        })} )  
      if(!existId)
        return response.status(400).json({code: 400, 
          msg: 'invalid id',
          detail: 'id not found'
        })
    }
    else{
      return response.status(400).json({code: 400, 
        msg: 'invalid id',
        detail: 'id not found'
      })   
    }

    const deletePopUpMessage = await PopUpMessage.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the Popup has been deleted successfully',
      data: deletePopUpMessage })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

module.exports = {getAllPopUp, createPopUp, getPopUp, updatePopUp, deletePopUp}
