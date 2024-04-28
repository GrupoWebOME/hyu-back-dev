const Order = require('../../models/order_model')
const Dealership = require('../../models/dealership_model')
const Installation = require('../../models/installation_schema')
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Provider = require('../../models/provider_model')

function getEuroFormat(price) {
  return price
    .toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    })
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const mailCreateBody = ({ number, dealershipName, installationName, createdAt, products }) => { 
  let productsHtml = ''
  let totalPrice = 0
  products?.forEach(element => {
    totalPrice = totalPrice + (element.price * element.count)
    productsHtml += `
      <div style="width: 100%; max-width: 30rem; padding-bottom: 1rem; border-bottom: solid 1px gainsboro">
        <p><span style="font-weight: 800">Item: </span> ${element.name}</p>
        <p><span style="font-weight: 800">Unidades: </span> ${element.count}</p>
        <p><span style="font-weight: 800">Precio Unidad: </span> ${getEuroFormat(element.price)}</p>
        <p><span style="font-weight: 800">Precio Total: </span> ${getEuroFormat(element.price * element.count)}</p>
      </div>
    `
  })

  const totalsHtml = `
    <div>
      <p><span style="font-weight: 800; font-size: 1.1rem; color: #3b82f6">Subtotal: </span>${getEuroFormat(totalPrice)}</p>
      <p><span style="font-weight: 800; font-size: 0.85rem;  color: #3b82f6">IVA: </span>${getEuroFormat((totalPrice) * 0.21)}</p>
      <p><span style="font-weight: 800; font-size: 1.1rem;  color: #3b82f6">Total: </span>${getEuroFormat(((totalPrice) * 0.21) + totalPrice)}</p>
      <p><span style="font-weight: 800; font-size: 0.85rem;  color: #3b82f6">Gastos de Envío no incluídos</span></p>
    </div>
  `

  return `
    <p>
      Estimado proveedor,
    </p> 
    <p>
      Paso a comunicarte un nuevo pedido de material:
    </p> 
    <p style="font-size: 1rem">
      <span style="font-weight: 600">Nº pedido HMES: </span> ${number}
    </p>
    <p style="font-size: 1rem">
      <span style="font-weight: 600">Concesión: </span>${dealershipName}
    </p>
    <p style="font-size: 1rem">
      <span style="font-weight: 600">Instalación: </span>${installationName}
    </p>
    <p style="font-size: 1rem">
      <span style="font-weight: 600">Fecha del Pedido: </span>${createdAt}
    </p>
    <p style="text-decoration: underline; margin-bottom: 1rem; font-size: 1rem; font-weight: 600">
      Material solicitado:
    </p>
    <div>
      ${productsHtml}
    </div>
    <div>
      ${totalsHtml}
    </div>
    <p>Para cualquier duda contactar con Hyundai Motor España.</p>
    <p>Recibe un cordial saludo,</p>
    <div style="margin-top: 1.2rem">
      <img src="https://res.cloudinary.com/hyundaiesp/image/upload/v1679065791/logos/hsa-firma-email_k3yldt.png" alt="hyundai firma" />
    </div>
`}

const mailCancelBody = ({ number, dealershipName, installationName, createdAt, products }) => { 
  let productsHtml = ''
  let totalPrice = 0
  products?.forEach(element => {
    totalPrice = totalPrice + (element.price * element.count)
    productsHtml += `
      <div style="width: 100%; max-width: 30rem; padding-bottom: 1rem; border-bottom: solid 1px gainsboro">
        <p><span style="font-weight: 800">Item: </span> ${element.name}</p>
        <p><span style="font-weight: 800">Unidades: </span> ${element.count}</p>
        <p><span style="font-weight: 800">Precio Unidad: </span> ${getEuroFormat(element.price)}</p>
        <p><span style="font-weight: 800">Precio Total: </span> ${getEuroFormat(element.price * element.count)}</p>
      </div>
    `
  })

  const totalsHtml = `
    <div>
      <p><span style="font-weight: 800; font-size: 1.1rem; color: #3b82f6">Subtotal: </span>${getEuroFormat(totalPrice)}</p>
      <p><span style="font-weight: 800; font-size: 0.85rem;  color: #3b82f6">Gastos de Envío: </span>350,00 €</p>
      <p><span style="font-weight: 800; font-size: 0.85rem;  color: #3b82f6">IVA: </span>${getEuroFormat((totalPrice + 350) * 0.21)}</p>
      <p><span style="font-weight: 800; font-size: 1.1rem;  color: #3b82f6">Total: </span>${getEuroFormat(((totalPrice + 350) * 0.21) + 350 + totalPrice)}</p>
    </div>
  `

  return `
    <p>
      Estimado proveedor,
    </p> 
    <p>
      Paso a comunicarte que se ha CANCELADO el siguiente pedido de material:
    </p> 
    <p style="font-size: 1rem">
      <span style="font-weight: 600">Nº pedido HMES: </span> ${number}
    </p>
    <p style="font-size: 1rem">
      <span style="font-weight: 600">Concesión: </span>${dealershipName}
    </p>
    <p style="font-size: 1rem">
      <span style="font-weight: 600">Instalación: </span>${installationName}
    </p>
    <p style="font-size: 1rem">
      <span style="font-weight: 600">Fecha del Pedido: </span>${createdAt}
    </p>
    <p style="text-decoration: underline; margin-bottom: 1rem; font-size: 1rem; font-weight: 600">
      Material solicitado:
    </p>
    <div>
      ${productsHtml}
    </div>
    <div>
      ${totalsHtml}
    </div>
    <p>Para cualquier duda contactar con Hyundai Motor España.</p>
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

function isValidMaterial(product) {
  if (!('family' in product) || !('name' in product) || !('product' in product) || !('count' in product) || !('price' in product) || !('pricePvpProd' in product)) {
    return false
  }

  if (typeof product.product !== 'string') {
    return false
  }

  if (typeof product.name !== 'string') {
    return false
  }

  if (typeof product.family !== 'string') {
    return false
  }

  if (!Number.isInteger(product.count) || product.count < 0) {
    return false
  }

  if (typeof product.price !== 'number' || isNaN(product.price)) {
    return false
  }

  if (typeof product.pricePvpProd !== 'number' || isNaN(product.pricePvpProd)) {
    return false
  }

  if (product.pricePvpMan !== null && product.pricePvpMan !== undefined && typeof product.pricePvpMan !== 'number' || isNaN(product.pricePvpMan)) {
    return false
  }

  return true
}

function nextCode(actualCode) {
  const actual = parseInt(actualCode.substring(4))
  const nextNumber = actual + 1
  const formatedNumber = String(nextNumber).padStart(6, '0')
  const newCode = 'PED-' + formatedNumber
  return newCode
}

const createOrder = async(request, response) => {
  try {
    const { dealership, installation, products, observations, orderNote } = request.body
    let errors = []
    let dealershipExist = null
    let installationExist = null

    if(!dealership){
      errors.push({code: 400, 
        msg: 'invalid dealership',
        detail: 'dealership is required'
      })
    } else if(dealership && !ObjectId.isValid(dealership)) {
      return response.status(400).json({code: 400,
        msg: 'invalid dealership',
        detail: 'dealership should be an objectId'})
    } else if(dealership){
      dealershipExist = await Dealership.findById(dealership)
      if(!dealershipExist)
        errors.push({code: 400, 
          msg: 'invalid dealership',
          detail: `${dealership} not found`
        })
    }

    if(!installation){
      errors.push({code: 400, 
        msg: 'invalid installation',
        detail: 'installation is required'
      })} else if(installation && !ObjectId.isValid(installation)) {
      return response.status(400).json({code: 400,
        msg: 'invalid installation',
        detail: 'installation should be an objectId'})
    } else if(installation){
      installationExist = await Installation.findById(installation)
      if(!installationExist)
        errors.push({code: 400, 
          msg: 'invalid installation',
          detail: `${installation} not found`
        })
    }

    if (!products || !Array.isArray(products)) {
      errors.push({code: 400, 
        msg: 'invalid products',
        detail: 'The products must be an array type'
      })
    } else {
      for (const product of products) {
        if (!isValidMaterial(product)) {
          errors.push({code: 400, 
            msg: 'invalid product',
            detail: `${product} is not in valid format`
          })
        }
      }
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const lastCreatedOrder = await Order.findOne().sort({ createdAt: -1 })
    const number = lastCreatedOrder?.number? nextCode(lastCreatedOrder?.number) : 'PED-000001'
    const newOrder = new Order({
      dealership, 
      installation, 
      products, 
      observations, 
      orderNote, 
      state: 'Abierto'
    })

    newOrder.number = `${number}`

    await newOrder.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const fechaMongo = new Date(newOrder?.createdAt)
    const dia = fechaMongo.getDate().toString().padStart(2, '0')
    const mes = (fechaMongo.getMonth() + 1).toString().padStart(2, '0')
    const anio = fechaMongo.getFullYear()
    const fechaFormateada = `${dia}-${mes}-${anio}`

    const emailsArr = ['estandares-hyundai@redhyundai.com']

    if (dealershipExist?.email?.length) {
      emailsArr.push(dealershipExist?.email)
    }

    const groupedByProvider = products.reduce((acc, curr) => {
      const { product, provider, ...rest } = curr
      const existingProviderIndex = acc.findIndex(item => item.provider.id === provider._id)
      
      if (existingProviderIndex === -1) {
        acc.push({
          provider: { id: provider._id, name: provider.name },
          products: [{ product, ...rest }]
        })
      } else {
        acc[existingProviderIndex].products.push({ product, ...rest })
      }
      
      return acc
    }, [])
    
    groupedByProvider.forEach(async item => {
      const content = mailCreateBody({ 
        number, 
        dealershipName: dealershipExist?.name, 
        installationName: installationExist?.name, 
        createdAt: fechaFormateada, 
        products: item.products
      })

      const providerData = await Provider.findById(item.provider?.id)
      let transformedEmails = emailsArr
      if (providerData?.emailP1?.length) {
        transformedEmails = [...transformedEmails, providerData?.emailP1]
      }
  
      if (providerData?.emailP2?.length) {
        transformedEmails = [...transformedEmails, providerData?.emailP2]
      }

      await sendMail(`Nuevo pedido material HMES ${number}`, content, transformedEmails)
    })

    response.status(201).json({
      code: 201,
      msg: 'the Order has been created successfully',
      data: newOrder
    })
  }
  catch(error) {
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateOrder = async(request, response) => {
  try{
    const {id} = request.params
    const { dealership, installation, products, observations, orderNote, state } = request.body
    let dealershipExist = null
    let installationExist = null
    let existId = null

    let errors = []

    if(id && ObjectId.isValid(id)){
      existId = await Order.findById(id)
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

    if(dealership && !ObjectId.isValid(dealership)) {
      return response.status(400).json({code: 400,
        msg: 'invalid dealership',
        detail: 'dealership should be an objectId'})
    }
    else if(dealership){
      dealershipExist = await Dealership.findById(dealership)
      if(!dealershipExist)
        errors.push({code: 400, 
          msg: 'invalid dealership',
          detail: `${dealership} not found`
        })
    }

    if(installation && !ObjectId.isValid(installation)) {
      return response.status(400).json({code: 400,
        msg: 'invalid installation',
        detail: 'installation should be an objectId'})
    }
    else if(installation){
      installationExist = await Installation.findById(installation)
      if(!installationExist)
        errors.push({code: 400, 
          msg: 'invalid installation',
          detail: `${installation} not found`
        })
    }

    if (state && state !== 'Solicitado' && state !== 'Cancelado' && state !== 'Entregado' && state !== 'En trámite' && state !== 'Abierto') {
      errors.push({code: 400, 
        msg: 'invalid state',
        detail: 'The state must be Abierto, Solicitado, Entregado, En trámite or Cancelado'
      })
    }

    const updatedFields = {}

    if(dealership)
      updatedFields['dealership'] = dealership
    if(installation)
      updatedFields['installation'] = installation
    if(observations)
      updatedFields['observations'] = observations
    if(products)
      updatedFields['products'] = products
    if(orderNote)
      updatedFields['orderNote'] = orderNote
    if(state)
      updatedFields['state'] = state
    updatedFields['updatedAt'] = Date.now()

    const emailsArr = ['estandares-hyundai@redhyundai.com']

    if (dealershipExist?.email?.length) {
      emailsArr.push(dealershipExist?.email)
    }

    const groupedByProvider = products.reduce((acc, curr) => {
      const { product, provider, ...rest } = curr
      const existingProviderIndex = acc.findIndex(item => item.provider.id === provider._id)
      
      if (existingProviderIndex === -1) {
        acc.push({
          provider: { id: provider._id, name: provider.name },
          products: [{ product, ...rest }]
        })
      } else {
        acc[existingProviderIndex].products.push({ product, ...rest })
      }
      
      return acc
    }, [])

    const updatedOrder = await Order.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    if (state === 'Cancelado' && existId?.state !== 'Cancelado') {
      const fechaMongo = new Date(updatedOrder?.createdAt)
      const dia = fechaMongo.getDate().toString().padStart(2, '0')
      const mes = (fechaMongo.getMonth() + 1).toString().padStart(2, '0')
      const anio = fechaMongo.getFullYear()
      const fechaFormateada = `${dia}-${mes}-${anio}`

      groupedByProvider.forEach(async item => {
        const content = mailCancelBody({ 
          number: updatedOrder?.number, 
          dealershipName: dealershipExist?.name, 
          installationName: installationExist?.name, 
          createdAt: fechaFormateada, 
          products: item.products
        })
  
        const providerData = await Provider.findById(item.provider?.id)
        let transformedEmails = emailsArr
        if (providerData?.emailP1?.length) {
          transformedEmails = [...transformedEmails, providerData?.emailP1]
        }
    
        if (providerData?.emailP2?.length) {
          transformedEmails = [...transformedEmails, providerData?.emailP2]
        }
  
        await sendMail(`CANCELACIÓN Pedido material HMES ${updatedOrder?.number}`, content, transformedEmails)
      })
    }

    response.status(201).json({
      code: 200,
      msg: 'the Order has been updated successfully',
      data: updatedOrder 
    })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteOrder = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await Order.exists({_id: id})
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

    const deleteOrder = await Order.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the Order has been deleted successfully',
      data: deleteOrder })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getOrder = async(request, response) => {
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
    
    const order = await Order.findById(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    
    if(order){
      response.status(200).json({code: 200,
        msg: 'success',
        data: order})
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

const getAllOrders = async(request, response) => {
  try{
    const { dealership, installation, state, pageReq } = request.body
    const authHeader = request.headers['authorization']

    const page = !pageReq ? 0 : pageReq

    let skip = (page - 1) * 10

    const filter = {}

    if(dealership)
      filter['dealership'] = dealership

    if(installation)
      filter['installation'] = installation

    if(state)
      filter['state'] = state

    if (authHeader) {
      const token = authHeader.split(' ')[1]
      let decodedToken = null
      await jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err){
          decodedToken = false
          return response.status(401).json({error: 'Unauthorized'})
        }
        else{
          decodedToken = decoded
        }
      })

      if(decodedToken?.admin?.dealership) {
        filter['dealership'] = decodedToken?.admin?.dealership
      }
    }

    if(page === 0){
      const order = await Order.find(filter).populate({
        path: 'dealership installation',
        select: '_id name'
      })
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })

      const orderData = order.map((order) => {
        const createdAt = new Date(order.createdAt)
        const currentDate = new Date()
        const differenceMs = currentDate - createdAt
        const differenceDays = differenceMs / (1000 * 60 * 60 * 24)

        return {
          ...order._doc, 
          dealershipName: order.dealership.name, 
          installationName: order.installation.name,
          createdProductDate: order.createdAt,
          orderNumber: order.number,
          backgroundColor: differenceDays > 30? 'red' : order.state === 'Abierto' ? 'green' : 'transparent'
        }
      })

      const data = {
        order: orderData, 
        totalPages: 1
      }

      return response.status(200).json({code: 200,
        msg: 'success',
        data: data })
    }
            
    let countDocs = await Order.countDocuments(filter)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

    if((countPage < page) && page !== 1)
      return response.status(400).json({code: 400, msg: 'invalid page', detail: `totalPages: ${countPage}`})

    const order = await Order.find(filter).populate({
      path: 'dealership installation',
      select: '_id name'
    }).skip(skip).limit(10)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const orderData = order.map((order) => {
      const createdAt = new Date(order.createdAt)
      const currentDate = new Date()
      const differenceMs = currentDate - createdAt
      const differenceDays = differenceMs / (1000 * 60 * 60 * 24)
      
      return {
        ...order._doc, 
        dealershipName: order.dealership.name, 
        installationName: order.installation.name,
        createdProductDate: order.createdAt,
        orderNumber: order.number,
        backgroundColor: differenceDays > 30? 'red' : order.state === 'Abierto' ? 'green' : 'transparent'
      }
    })

    const data = {
      orders: orderData, 
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

module.exports = { createOrder, updateOrder, deleteOrder, getOrder, getAllOrders }
