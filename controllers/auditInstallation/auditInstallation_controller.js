const AuditInstallation = require('../../models/audit_installation_model')
var ObjectId = require('mongodb').ObjectId
const nodemailer = require('nodemailer')

const plannedMailContent = (installation) => { return `
    <p>
        Estimado concesionario,
    </p> 
    <p>
        Paso a comunicarte que la auditoría de este trimestre para la instalación <b>${installation}</b> ya se encuentra con fecha asignada para auditar 
    </p> 
    <p>
        Esta informacion se encuentra accesible a través de la aplicación de Estándares HMES. Para cualquier duda contactar con Elena Drandar: 
        <span>estandares@redhyundai.com</span>.
    </p> 
    <p>
        Recibe un cordial saludo,
    </p>
`}

const reviewMailContent = (installation) => { return `
    <p>
        Estimado concesionario,
    </p> 
    <p>
        Paso a comunicarte que la auditoría de este trimestre para la instalación <b>${installation}</b> está finalizada por parte del auditor y se encuentra en Pendiente revisar concesión. 
    </p> 
    <p>
        Antes de publicar los resultados definitivos, queremos ofrecerte la posibilidad de revisar
        aquellos incumplimientos que consideres puedan ser susceptibles de emitir alegaciones para
        ser revisadas por HMES. En caso de que compruebes, que efectivamente, existe una
        justificación razonable para alegar un incumplimiento, podrás realizar la alegación incluyendo
        toda aquella información que consideréis necesaria, fotos y/o comentarios.
    </p> 
    <p>
        El plazo de alegaciones será de <b>una semana</b> contando a partir del día de hoy.
    </p>
    <p>
        Esta informacion se encuentra accesible a través de la aplicación de Estándares HMES. Para
        cualquier duda contactar con Elena Drandar: estandares@redhyundai.com.
    </p>
    <p>
        Recibe un cordial saludo,
    </p>
`}

const closedMailContent = (installation) => { return `
    <p>
        Estimado concesionario,
    </p> 
    <p>
        Paso a comunicarte que la auditoría de este trimestre para la instalación: <b>${installation}</b> se encuentra <b>cerrada</b> desde este momento puedes acceder para consultar los resultados. 
    </p> 
    <p>
        Antes de publicar los resultados definitivos, queremos ofrecerte la posibilidad de revisar
        aquellos incumplimientos que consideres puedan ser susceptibles de emitir alegaciones para
        ser revisadas por HMES. En caso de que compruebes, que efectivamente, existe una
        justificación razonable para alegar un incumplimiento, podrás realizar la alegación incluyendo
        toda aquella información que consideréis necesaria, fotos y/o comentarios.
    </p> 
    <p>
        El plazo de alegaciones será de <b>una semana</b> contando a partir del día de hoy.
    </p>
    <p>
        Esta informacion se encuentra accesible a través de la aplicación de Estándares HMES. Para
        cualquier duda contactar con Elena Drandar: estandares@redhyundai.com.
    </p>
    <p>
        Recibe un cordial saludo,
    </p>
`}

const plannedMailsubject = 'Notificación Auditoría planificada'
const reviewMailsubject = 'Notificación Auditoría en Pendiente revisar concesión - Alegaciones'
const closedMailSubject = 'Notificación Auditoría Cerrada'

const updateAuditInstallation = async(request, response) => {
    try{
        const {id} = request.params
        const {comment, audit_status, audit_date, photo} = request.body
        const regexDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/

        let errors = []
    
        if(!id)
            return response.status(400).json({code: 400,
                                              msg: 'invalid id',
                                              detail: 'id is a obligatory field'})

        if(id && !ObjectId.isValid(id))
            return response.status(400).json({code: 400,
                                            msg: 'invalid id',
                                            detail: 'id should be an objectId'})

        let auditInstallation = null
        
        if(id){
            auditInstallation = await AuditInstallation.findById(id).populate('installation_id audit_id')
            if (!auditInstallation)
                return response.status(404).json({code: 404,
                                                  msg: 'invalid id',
                                                  detail: 'id not found'})
        }

        if(comment !== null && comment !== undefined && comment.length < 1)
            errors.push({code: 400, 
                         msg: 'invalid comment',
                         detail: `${comment} is not valid comment format.`
                        })

        if(photo !== null && photo !== undefined && photo.length < 1)
            errors.push({code: 400, 
                         msg: 'invalid photo',
                         detail: `${photo} is not valid photo format.`
                        })

        if(audit_status !== null && audit_status !== undefined && audit_status !== 'created' && audit_status !== 'canceled' && audit_status !== 'planned' &&
            audit_status !== 'in_process' && audit_status !== 'auditor_signed' && audit_status !== 'auditor_end' && audit_status !== 'closed' 
            && audit_status !== 'review' && audit_status !== 'review_hmes' && audit_status !== 'finished' ){
                errors.push({code: 400, 
                                msg: 'invalid audit_status',
                                detail: `audit_status should be created, canceled, planned, in_process, auditor_signed, auditor_end, review, review_hmes, finished or closed`
                            })  
        }

        if(audit_date && !audit_date.match(regexDate)){
            errors.push({code: 400, 
                msg: 'invalid audit_date',
                detail: `audit_date should be yyyy-mm-dd format`
            })
        }

        if(errors.length > 0)
            return response.status(400).json({errors: errors})
    
        const editAuditInst = {}

        if(comment)
            editAuditInst['comment'] = comment

        if(photo)
            editAuditInst['photo'] = photo

        if(audit_status)
            editAuditInst['audit_status'] = audit_status

        if(audit_date){
            editAuditInst['audit_date'] = audit_date
            editAuditInst['audit_status'] = 'planned'
        }

        editAuditInst['updatedAt'] = Date.now()

        const auditInst = await AuditInstallation.findByIdAndUpdate(id, editAuditInst, {new: true})
                                        .catch( error => {return response.status(500).json({code: 500, msg: 'created error', detail: error.message})})
        
        if(audit_status === 'planned' && !auditInstallation.audit_id.mistery){
            await sendMail(plannedMailsubject, plannedMailContent(auditInstallation.installation_id.name))
        } else if(audit_status === 'review'){
            await sendMail(reviewMailsubject, reviewMailContent(auditInstallation.installation_id.name))
        } else if(audit_status === 'closed'){
            await sendMail(closedMailSubject, closedMailContent(auditInstallation.installation_id.name))
        }

        response.status(200).json({code: 200,
                                   msg: 'the AuditInstallation has been updated successfully',
                                   data: auditInst })
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }          
}

const getAllAuditInstallation = async(request, response) => {
    try{
        const {installation_id, dealership_id, audit_id, pageReq} = request.body
        const admin = request.jwt

        const page = !pageReq ? 0 : pageReq

        let skip = (page - 1) * 10

        const filter = {}

        if(installation_id)
            filter['installation_id'] = installation_id
            
        if(dealership_id)
            filter['dealership_id'] = dealership_id

        if(audit_id)
            filter['audit_id'] = audit_id

        /*
        if(admin?.admin?.role === 'auditor')
            filter['audit_status'] = {$in: ['planned', 'in_process']}

        if(admin?.admin?.role === 'superauditor')
            filter['audit_status'] = {$in: ['planned', 'in_process', 'auditor_signed']}

        if(admin?.admin?.role === 'dealership')
            filter['audit_status'] = {$in: ['closed', 'canceled', 'review', 'planned', 'review_hmes', 'in_process', 'auditor_signed', 'auditor_end', 'finished']}
        */
        
        if(page === 0){
            let auditInstallations = await AuditInstallation.find(filter).populate('installation_id auditor_id')

            const data = {auditInstallations: auditInstallations, 
                          totalPages: 1}

            return response.status(200).json({code: 200,
                                              msg: 'success',
                                              data: data })
        }
            
        let countDocs = await AuditInstallation.countDocuments(filter)

        let countPage = countDocs % 10 === 0? countDocs/10 : Math.floor((countDocs/10) + 1)

        if((countPage < page) && page !== 1)
            return response.status(400).json({code: 400, 
                                              msg: 'invalid page', 
                                              detail: `totalPages: ${countPage}`})

        const auditInstallations = await AuditInstallation.find(filter).populate('installation_id auditor_id').skip(skip).limit(10)
        
        const data = {auditInstallations: auditInstallations, 
                      totalPages: countPage}

        response.status(200).json({code: 200,
                                   msg: 'success',
                                   data: data })
    }
   catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
    }  
}

const sendMail = async(subject, content) => {    
    try{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_SENDER,
              pass: process.env.EMAIL_PASSWORD,
            }
          });
          
          var mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: process.env.EMAIL_SENDER,
            subject: subject,
            html: content
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log('error: ', error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          return
    }
    catch(error){
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
    }
}

module.exports = {updateAuditInstallation, getAllAuditInstallation}
