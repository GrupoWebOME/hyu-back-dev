const Audit = require('../../models/audit_model')
const Dealership = require('../../models/dealership_model')
const AuditResults = require('../../models/audit_results_model')
const Criterion = require('../../models/criterion_model')
const Installation = require('../../models/installation_schema')
const AuditInstallation = require('../../models/audit_installation_model')
const AuditAgency = require('../../models/audit_agency_model')
const Admin = require('../../models/admin_model')
const ObjectId = require('mongodb').ObjectId
const { SHOW_RESULTS_STATES } = require('../../utils/constants')

const createAuditResults = async(request, response) => {
  try{
    const {audit_id, installation_id, criterions} = request.body

    let errors = []

    if(!audit_id){
      errors.push({code: 400, 
        msg: 'invalid audit_id',
        detail: 'audit_id is an obligatory field'
      })
    }
    else{
      if(!ObjectId.isValid(audit_id)){
        errors.push({code: 400, 
          msg: 'invalid audit_id',
          detail: `${audit_id} is not an ObjectId`
        })  
      }
      else{
        const existAudit = await Audit.exists({_id: audit_id})
        if(!existAudit)
          errors.push({code: 400, 
            msg: 'invalid audit_id',
            detail: `${audit_id} not found`
          })   
      }
    }

    const auditResultsFind = await AuditResults.findOne({audit_id: audit_id, installation_id: installation_id})

    if(auditResultsFind)
      errors.push({code: 400, 
        msg: 'invalid installation_id',
        detail: 'installation_id has already been audited'
      })

    if(!installation_id){
      errors.push({code: 400, 
        msg: 'invalid installation_id',
        detail: 'installation_id is an obligatory field'
      })
    }
    else{
      if(!ObjectId.isValid(installation_id)){
        errors.push({code: 400, 
          msg: 'invalid installation_id',
          detail: `${installation_id} is not an ObjectId`
        })  
      }
      else{
        const existInstallation = await Installation.exists({_id: installation_id})
        if(!existInstallation)
          errors.push({code: 400, 
            msg: 'invalid installation_id',
            detail: `${installation_id} not found`
          })   
      }
    }

    if(!criterions || !Array.isArray(criterions)){
      errors.push({code: 400, 
        msg: 'invalid criterions',
        detail: 'criterions is an obligatory field, and should be an array type'
      })
    }
    else if(criterions){

      criterions.forEach(async(element) => {
        if(!element.hasOwnProperty('criterion_id') || !element.hasOwnProperty('pass')){
          errors.push({code: 400, 
            msg: 'invalid criterions',
            detail: 'criterions should be contains criterion_id and pass fields'
          })
        }
        else if(!ObjectId.isValid(element.criterion_id)){
          errors.push({code: 400, 
            msg: 'invalid criterion_id',
            detail: `${element.criterion_id} is not an ObjectId`
          })  
        }
        else{                
          const existCriterion = await Criterion.exists({_id: element.criterion_id})
          if(!existCriterion)
            errors.push({code: 400, 
              msg: 'invalid criterion_id',
              detail: `${element.criterion_id} not found`
            })        
        }
      })
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const newAuditResults = new AuditResults({
      audit_id,
      installation_id,
      criterions,
      state: 'created'
    })

    await newAuditResults.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    await AuditInstallation.findByIdAndUpdate({installation_id: installation_id}, {audit_status: 'in_process'})
      .catch( error => {return response.status(500).json({code: 500, msg: 'created error', detail: error.message})})

    response.status(201).json({code: 201,
      msg: 'the auditResults has been created successfully',
      data: newAuditResults })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const deleteAuditResults = async(request, response) => {
  try{
    const {id} = request.params

    if(id && ObjectId.isValid(id)){
      const existId = await Audit.exists({_id: id})
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
    const deletedAudit = await Audit.findByIdAndDelete(id)
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })
    response.status(201).json({code: 200,
      msg: 'the Audit has been deleted successfully',
      data: deletedAudit })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getDataForTables = async(request, response) => {
  const {dealership_id, audit_id} = request.body
  try{
    if(!ObjectId.isValid(dealership_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid dealership_id', 
          detail: `${dealership_id} is not an ObjectId`}]})
    }
    const dealershipByID = await Dealership.findById(dealership_id)

    if(!dealershipByID)
      return response.status(400).json({code: 404, 
        msg: 'invalid dealership_id',
        detail: 'dealership_id not found'
      })
    let existAudit = null
    if(!ObjectId.isValid(audit_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid audit_id', 
          detail: `${audit_id} is not an ObjectId`}]})
    }
    else{
      existAudit = await Audit.findById(audit_id)
      if(!existAudit)
        return response.status(400).json(
          {errors: [{code: 400, 
            msg: 'invalid audit_id', 
            detail: `${audit_id} not found`}]}) 
    }

    //Obtengo todas los resultados de auditorías que pertenezcan a las instalaciones de una agencia en particular, y una auditoría en particular
    let auditsResults = await AuditResults.find({$and:[{installation_id: {$in: dealershipByID.installations}},{audit_id: audit_id}]})
      .populate({ path: 'installation_id', 
        select: '_id active name code installation_type dealership sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
        populate: {path: 'installation_type dealership', select: '_id code active'}})
      .populate({ path: 'criterions.criterion_id', 
        populate: {
          path: 'standard block area category auditResponsable criterionType installationType',
          select: 'name code description isCore number abbreviation'
        },
      }) 

    let auditResultsWithoutInactiveInst = [] 

    auditsResults.forEach((element) => {
      if(element.installation_id.active && element.installation_id.dealership.active){
        auditResultsWithoutInactiveInst = [...auditResultsWithoutInactiveInst, element]
      }
    } )          

    const auditsResultsAux = auditResultsWithoutInactiveInst       

    let arrayForCore = []

    let arrayStandardsFalse = []
    let arrayAreasFalse = []

    //Recorro el arreglo de resultados
    auditResultsWithoutInactiveInst.forEach((element) => {
      element.criterions.forEach((criterion) => {
        if(!criterion.pass && !criterion.criterion_id.exceptions.includes(element.installation_id._id)){
          const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
          if(!existStandard){
            arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
          }
          if(criterion.criterion_id.standard.isCore){
            const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
            if(!existArea){
              arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
            }
          }
        }
      })
      //Genero un arreglo que incluye para cada instalación los standards y areas afectadas por core no cumplidos
      arrayForCore = [...arrayForCore, {
        id: element.installation_id._id.toString(),
        arrayStandardsFalse: arrayStandardsFalse,
        arrayAreasFalse: arrayAreasFalse
      }]
    })

    if(existAudit?.isCustomAudit){
      arrayStandardsFalse = []
      arrayAreasFalse = []
    }

    const auditResultsForImgAndHme = [...auditResultsWithoutInactiveInst]

    let instalations_audit_details = []
    let instalation_audit_types = null

    const VENTA = '6233b3ace74b428c2dcf3068'
    const POSVENTA = '6233b450e74b428c2dcf3091'
    const HYUNDAI_PROMISE = '6233b445e74b428c2dcf3088'
    const GENERAL = '6233b39fe74b428c2dcf305f'

    let totalWeightPerc = 0

    let totalImgAudit = 0
    let totalPassImgAudit = 0
    let totalHmeAudit = 0
    let totalPassHmeAudit = 0
    let totalIoniqAudit = 0
    let totalPassIoniqAudit = 0

    //<<<NUEVO
    auditResultsForImgAndHme.forEach((element) => {
      // Criterios hme, img
      element.criterions.forEach((criterion) => {     
        let isValidType = false
        criterion.criterion_id.installationType.forEach((type) => {
          if(type._id.toString() === element.installation_id.installation_type._id.toString()){
            isValidType = true
          }
        })
        // Si es inválido
        if(!(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
        criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
        criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP ||
        criterion.criterion_id.exceptions.includes(element.installation_id._id) ||
        !isValidType)){ 
          if(criterion.criterion_id.isImgAudit){
            // Peso total de los criterios imgAudit que aplican
            totalImgAudit+= criterion.criterion_id.value
            if(criterion.pass)
              totalPassImgAudit+= criterion.criterion_id.value
            // Peso total de los criterios imgAudit que aplican
          }
          if(criterion.criterion_id.isIoniqAudit){
            // Peso total de los criterios imgAudit que aplican
            totalIoniqAudit+= criterion.criterion_id.value
            if(criterion.pass)
              totalPassIoniqAudit+= criterion.criterion_id.value
            // Peso total de los criterios imgAudit que aplican
          }
          if(criterion.criterion_id.isHmeAudit){
            // Peso total de los criterios hmes que aplican
            totalHmeAudit+= 1// criterion.criterion_id.value
            if(criterion.pass)
              totalPassHmeAudit+= 1 //criterion.criterion_id.value
            // Peso total de los criterios hmes que aplican
          }
        }
      })
    })
    //>>>

    //Convierto en false los criterios afectados por core
    if(!existAudit?.isCustomAudit){
      auditsResultsAux.forEach((element, indexEl) => {
        //Selecciono los elementos de arrayforcore para la instalación que me encuentro recorriendo
        const finded = arrayForCore.find( el => el.id === element.installation_id._id.toString() )
        element.criterions.forEach((criterion, index) => {
          const existSt = finded.arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
          const existAr = finded.arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
          if(existAr || existSt){
            //Pongo en false los criterios afectados por el core
            auditsResultsAux[indexEl].criterions[index].pass = false
          }
        })
      })
    }

    //Ordeno el arreglo por standard id
    auditResultsWithoutInactiveInst.forEach((element) => {
      element.criterions.sort(function (a, b) {
        if (a.criterion_id.standard._id.toString() > b.criterion_id.standard._id.toString()) {
          return 1
        }
        if (a.criterion_id.standard._id.toString() < b.criterion_id.standard._id.toString()) {
          return -1
        }
        return 0
      })
    })

    auditResultsWithoutInactiveInst.forEach((element) => {
      let installationAuditData = {}
      installationAuditData['installation'] =  element.installation_id
      let actualCategoryID = ''
      let actualCategoryName = ''
      let accum = 0
      let totalAccum = 0
      let totalCriterionsByCat = 0
      let categories = []
      let totalCriterionsForInst = 0
      let categoriesAux = null
      let totalElectricAudit = 0
      let totalPassElectricAudit = 0
      let totalCritValid = 0
      let totalCriterionWeight = 0

      const sales_weight_per_installation= (element.installation_id.sales_weight_per_installation !== null)? element.installation_id.sales_weight_per_installation : 0
      const post_sale_weight_per_installation= (element.installation_id.post_sale_weight_per_installation !== null)? element.installation_id.post_sale_weight_per_installation : 0

      // Es la sumatoria de los pesos de cada instalación
      totalWeightPerc +=  sales_weight_per_installation + post_sale_weight_per_installation

      // Criterios electricos, hme, img
      element.criterions.forEach((criterion) => {     
        let isValidType = false
        criterion.criterion_id.installationType.forEach((type) => {
          if(type._id.toString() === element.installation_id.installation_type._id.toString()){
            isValidType = true
          }
        })
        // Si es inválido
        if(!(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
        criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
        criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP ||
        criterion.criterion_id.exceptions.includes(element.installation_id._id) ||
        !isValidType)){ 
          // Peso total de los criterios que aplican
          if(criterion.criterion_id.isHmeAudit){
            totalCriterionWeight += 1
          } else{
            totalCriterionWeight += criterion.criterion_id.value
          }
          // Cantidad de criterios que aplican para esa instalación
          totalCriterionsForInst += 1
          
          if(criterion.criterion_id.isElectricAudit){
            // Peso total de los criterios Electric que aplican
            totalElectricAudit+= criterion.criterion_id.value
            if(criterion.pass)
              totalPassElectricAudit+= criterion.criterion_id.value
            // Peso total de los criterios hmes que aplican
          }
        }
      })
      // Los demás criterios
      element.criterions.forEach((criterion) => {
        let isValidType = false
        criterion.criterion_id.installationType.forEach((type) => {
          if(type._id.toString() === element.installation_id.installation_type._id.toString()){
            isValidType = true
          }
        })
        // El criterio no aplica
        if(!(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
        criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
        criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
        criterion.criterion_id.exceptions.includes(element.installation_id._id) ||
        !isValidType)){
          // Si actualCategoryID es igual a '', entonces le asigno el categoryID actual
          if(actualCategoryID.length === 0){
            actualCategoryID = criterion.criterion_id.category._id.toString()
            actualCategoryName = criterion.criterion_id.category.name.toString()
          }

          // Defino el multiplicador
          let multiplicator = 1
          if(actualCategoryID === VENTA){
            if(element.installation_id.sales_weight_per_installation !== null){
              multiplicator = element.installation_id.sales_weight_per_installation/100
            }
            else{
              multiplicator = 1
            }
          }
          else if(actualCategoryID === POSVENTA){
            if(element.installation_id.post_sale_weight_per_installation !== null){
              multiplicator = element.installation_id.post_sale_weight_per_installation/100
            }
            else{
              multiplicator = 1
            }
          }
          else{
            multiplicator = 1
          }

          totalCritValid += 1

          //Si la categoría actual es igual que la anterior
          if((criterion.criterion_id.category._id.toString() === actualCategoryID)){
            //Cantidad de criterios para esta categoría
            totalCriterionsByCat += 1
            if(criterion.pass){
              //Cantidad de peso acumulado de los cumplidos
              if(criterion.criterion_id.isHmeAudit){
                accum += 1
              } else{
                accum += criterion.criterion_id.value
              }
            }
            //Cantidad acumulada de peso total para esa categoría
            if(criterion.criterion_id.isHmeAudit){
              totalAccum += 1
            } else{
              totalAccum += criterion.criterion_id.value
            }
            // Si la cantidad recorrida de criterios en esta instalación, es igual al total de criterios que tiene esa instalación
            // Entonces guarda la categoría en el arreglo de categorias de esa instalación.
            if(totalCritValid === totalCriterionsForInst){
              const perc = ((accum * 100)/totalAccum) * multiplicator
              const category = {
                id: actualCategoryID.toString(),
                name: actualCategoryName,
                pass: accum,
                total: totalAccum,
                percentageByInstallation: (accum * 100)/totalAccum,
                totalCriterionsByCat: totalCriterionsByCat,
                percentage: perc,
                partialPercentage: (accum * 100) / totalCriterionWeight
              }

              categories = [...categories, category]

              let newTotal = 0

              if(categories.length>0){
                categories.forEach((category) => {
                  newTotal += category.partialPercentage
                  const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                  category['totalCriterionsPercByCat'] = percByCrit * category.percentage / 100
                })
              }
              else if(totalCriterionsForInst>0){
                const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                categoriesAux['totalCriterionsPercByCat'] = percByCrit * categoriesAux.percentage / 100
                categories = [...categories, categoriesAux]
              }
                            
              const auditTotalResult = newTotal 
              categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

              installationAuditData['categories'] = categories

              instalation_audit_types = {
                percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                percIonicAudit: totalImgAudit === 0? null : (totalPassIoniqAudit * 100)/totalIoniqAudit,
                percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
              }

              installationAuditData['instalation_audit_types'] =  instalation_audit_types

              instalations_audit_details = [...instalations_audit_details, installationAuditData]
            }
          }
          //Si la categoría actual es diferente que la anterior
          else{
            // Si no es el primer elemento del arreglo de criterios que aplican, o si tiene solo uno, lo guarda en el arreglo de categorias
            if(totalCritValid !== 1 || totalCriterionsForInst === 1){
              const perc = ((accum * 100)/totalAccum) * multiplicator
              const category = {
                id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
                name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
                pass: accum,
                total: totalAccum,
                percentageByInstallation: (accum * 100)/totalAccum,
                totalCriterionsByCat: totalCriterionsByCat,
                percentage: perc,
                partialPercentage: (accum * 100) / totalCriterionWeight
              }
              categories = [...categories, category]
            }

            totalCriterionsByCat = 1
            if(criterion.criterion_id.isHmeAudit){
              totalAccum = 1
            } else{
              totalAccum = criterion.criterion_id.value
            }
            if(criterion.pass){
              if(criterion.criterion_id.isHmeAudit){
                accum = 1
              } else{
                accum = criterion.criterion_id.value
              }
            }
            else{
              accum = 0
            }
            actualCategoryID = criterion.criterion_id.category._id.toString()
            actualCategoryName = criterion.criterion_id.category.name
            // Si estoy recorriendo el último elemento, entonces lo almaceno
            if(totalCritValid === totalCriterionsForInst && totalCriterionsForInst !== 1){
              const perc = ((accum * 100)/totalAccum) * multiplicator
              const category = {
                id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
                name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
                pass: accum,
                total: totalAccum,
                percentageByInstallation: (accum * 100)/totalAccum,
                totalCriterionsByCat: totalCriterionsByCat,
                percentage: perc,
                partialPercentage: (accum * 100) / totalCriterionWeight
              }
              categories = [...categories, category]

              let newTotal = 0
              if(categories.length>0){
                categories.forEach((category) => {
                  newTotal += category.partialPercentage
                  const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                  category['totalCriterionsPercByCat'] = percByCrit * category.percentage / 100
                })
              }
              else if(totalCriterionsForInst>0){
                const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                categoriesAux['totalCriterionsPercByCat'] = percByCrit * categoriesAux.percentage / 100
                categories = [...categories, categoriesAux]
              }

              const auditTotalResult = newTotal
              categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

              installationAuditData['categories'] = categories

              instalation_audit_types = {
                percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                percIonicAudit: totalImgAudit === 0? null : (totalPassIoniqAudit * 100)/totalIoniqAudit,
                percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
              }

              installationAuditData['instalation_audit_types'] =  instalation_audit_types

              instalations_audit_details = [...instalations_audit_details, installationAuditData]
            }
          }
        }      
      })
    })

    let accumAgency = 0

    let hp_perc = 0
    let general_perc = 0
    let v_perc = 0
    let pv_perc = 0

        
    let electric_total = 0
    let electric_perc = 0
    let img_total = 0
    let img_perc = 0
    let hme_total = 0
    let hme_perc = 0
    let agency_by_types_customs = []
    let agency_by_types_customs_total = []


    instalations_audit_details.forEach((installation) => {
      if(installation && installation.categories){
        const sales_weight_per_installation= (installation.installation.sales_weight_per_installation !== null)? installation.installation.sales_weight_per_installation : 0
        const post_sale_weight_per_installation= (installation.installation.post_sale_weight_per_installation !== null)? installation.installation.post_sale_weight_per_installation : 0
        let accumTotalWeightPerc = sales_weight_per_installation + post_sale_weight_per_installation
        const coefficient = ((accumTotalWeightPerc * 100) / totalWeightPerc)/100

        accumAgency += installation.categories[installation.categories.length - 1].auditTotalResult
        installation.categories.forEach((category) => {
          if(category.id === HYUNDAI_PROMISE){
            hp_perc += category.partialPercentage * coefficient
          }
          else if(category.id === GENERAL){
            general_perc += category.partialPercentage * coefficient
          }
          else if(category.id === VENTA){
            v_perc += category.partialPercentage * coefficient
          }
          else if(category.id === POSVENTA){
            pv_perc += category.partialPercentage * coefficient
          }
          else{
            const nameCategory = category.name
            const promedioCategory = category.partialPercentage
            const indexFinded = agency_by_types_customs.findIndex((el) => el.nameCategory === nameCategory)
            if(indexFinded >= 0){
              agency_by_types_customs_total[indexFinded].total = agency_by_types_customs_total[indexFinded].total + 1
              agency_by_types_customs[indexFinded].promedioCategory = agency_by_types_customs[indexFinded].promedioCategory + promedioCategory
            }
            else{
              agency_by_types_customs_total = [...agency_by_types_customs_total, {nameCategory: nameCategory, total: 1}]
              agency_by_types_customs = [...agency_by_types_customs, {nameCategory: nameCategory, promedioCategory: promedioCategory}]
            }
          }
        })

      }

      if(installation && installation.instalation_audit_types){
        if(installation.instalation_audit_types.percImgAudit !== null){
          img_perc+= installation.instalation_audit_types.percImgAudit
          img_total+= 1
        }
        if(installation.instalation_audit_types.percElectricAudit !== null){
          electric_perc+= installation.instalation_audit_types.percElectricAudit
          electric_total+= 1
        }
        if(installation.instalation_audit_types.percHmeAudit !== null){
          hme_perc+= installation.instalation_audit_types.percHmeAudit
          hme_total+= 1
        }
      }
    })
        
    let agency_by_types = {
      electric_perc: (electric_total === 0)? null: electric_perc / electric_total,
      img_perc: (img_total === 0)? null: img_perc / img_total,
      hme_perc: (hme_total === 0)? null: hme_perc / hme_total,

      hp_perc: (hp_perc === 0)? null: hp_perc,
      v_perc: (v_perc === 0)? null: v_perc,
      general_perc: (general_perc === 0)? null: general_perc,
      pv_perc: (pv_perc === 0)? null: pv_perc,
    }

    if(existAudit?.isCustomAudit){
      agency_by_types_customs.forEach((element, index) => {
        agency_by_types_customs[index].promedioCategory = agency_by_types_customs[index].promedioCategory / agency_by_types_customs_total[index].total
      })
    }

    let indexDelEl = -1

    agency_by_types_customs.forEach((el, index) => {
      if(el.nameCategory === undefined || el.nameCategory === null || el.promedioCategory === NaN){
        indexDelEl = index
      }
    })

    if(indexDelEl > -1){
      agency_by_types_customs.splice(indexDelEl, 1)
    } else{
      agency_by_types_customs.pop()
    }
        
    agency_by_types['agency_by_types_customs'] = agency_by_types_customs

    let total_agency = 0

    if(!existAudit?.isCustomAudit){
      total_agency = (agency_by_types.hp_perc !== null? agency_by_types.hp_perc: 0) + (agency_by_types.v_perc !== null? agency_by_types.v_perc: 0) + (agency_by_types.general_perc !== null? agency_by_types.general_perc: 0) + (agency_by_types.pv_perc !== null? agency_by_types.pv_perc: 0) 
    } else {
      agency_by_types_customs.forEach((element) => {
        total_agency += element.promedioCategory
      })
    }

    agency_by_types['total_agency'] = total_agency

    const agency_audit_details = accumAgency / instalations_audit_details.length

    let data = {
      audit_name: existAudit.name,
      audit_details: existAudit,
      dealership_details: dealershipByID,
      audit_criterions_details: auditsResults,
      instalations_audit_details: instalations_audit_details,
      agency_audit_details: agency_audit_details,
      agency_by_types: agency_by_types
    }

    return response.status(200).json({data: data})
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getDataForFullAudit = async(request, response) => {
  const {audit_id} = request.params
  let auditsResults = null
  let arrayDealershipsAudit = []
  try{
    let existAudit = null

    if(!ObjectId.isValid(audit_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid audit_id', 
          detail: `${audit_id} is not an ObjectId`}]})
    }
    else{
      existAudit = await Audit.findById(audit_id)
      if(!existAudit)
        return response.status(400).json(
          {errors: [{code: 400, 
            msg: 'invalid audit_id', 
            detail: `${audit_id} not found`}]}) 
    }

    auditsResults = await AuditResults.find({audit_id: audit_id})
      .populate({path: 'installation_id', select: 'dealership active', 
        populate: {path: 'dealership', select: 'active'}})

    let auditResultsWithoutInactiveInst  = []

    auditsResults.forEach((element) => {
      if(element.installation_id.active && element.installation_id.dealership.active){
        auditResultsWithoutInactiveInst = [...auditResultsWithoutInactiveInst, element]
      }
    })

    let arrayOfDealerships = []

    auditResultsWithoutInactiveInst.forEach((element) => {
      if(!arrayOfDealerships.includes(element.installation_id.dealership._id.toString())){
        arrayOfDealerships = [...arrayOfDealerships, element.installation_id.dealership._id.toString()]
      }
    })

    let compliance_audit = 0

    for(let i = 0; i < arrayOfDealerships.length; i++){
      const dealership = arrayOfDealerships[i]

      const dealershipByID = await Dealership.findById(dealership)
      let auditsResults = await AuditResults.find({$and:[{installation_id: {$in: dealershipByID.installations}},{audit_id: audit_id}]})
        .populate({path: 'installation_id', select: '_id name code dealership active installation_type sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
          populate: {path: 'installation_type dealership', select: '_id code active'}})
        .populate({ path: 'criterions.criterion_id', 
          populate: {
            path: 'standard block area category auditResponsable criterionType installationType',
            select: 'name code description isCore active number abbreviation'
          },
        }) 
                                                            
      let auditResultsWithoutInactiveInst = []

      auditsResults.forEach((element) => {
        if(element.installation_id.active && element.installation_id.dealership.active){
          auditResultsWithoutInactiveInst = [...auditResultsWithoutInactiveInst, element]
        }
      } )  

      const auditsResultsAux = auditResultsWithoutInactiveInst                                            
      let arrayForCore = []
      let arrayStandardsFalse = []
      let arrayAreasFalse = []

      auditResultsWithoutInactiveInst.forEach((element) => {
        element.criterions.forEach((criterion) => {
          if(!criterion.pass){
            const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
            if(!existStandard){
              arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
            }
            if(criterion.criterion_id.standard.isCore){
              const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
              if(!existArea){
                arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
              }
            }
          }
        })

        arrayForCore = [...arrayForCore, {
          id: element.installation_id._id.toString(),
          arrayStandardsFalse: arrayStandardsFalse,
          arrayAreasFalse: arrayAreasFalse
        }]
      })

      if(existAudit?.isCustomAudit){
        arrayStandardsFalse = []
        arrayAreasFalse = []
      }

      if(!existAudit?.isCustomAudit){
        auditsResultsAux.forEach((element, indexEl) => {
          const finded = arrayForCore.find( el => el.id === element.installation_id._id.toString() )
          element.criterions.forEach((criterion, index) => {
            const existSt = finded.arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
            const existAr = finded.arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
            if(existAr || existSt){
              auditsResultsAux[indexEl].criterions[index].pass = false
            }
          })
        })
      }

      let instalations_audit_details = []
      let instalation_audit_types = null
    
      const VENTA = '6233b3ace74b428c2dcf3068'
      const POSVENTA = '6233b450e74b428c2dcf3091'
      const HYUNDAI_PROMISE = '6233b445e74b428c2dcf3088'
      const GENERAL = '6233b39fe74b428c2dcf305f'

      let totalWeightPerc = 0

      auditResultsWithoutInactiveInst.forEach((element) => {
        let installationAuditData = {}
        installationAuditData['installation'] =  element.installation_id
        let actualCategoryID = ''
        let actualCategoryName = ''
        let accum = 0
        let totalAccum = 0
        let totalCriterionsByCat = 0
        let categories = []
        let totalCriterionsForInst = 0
        let categoriesAux = null
    
        let totalImgAudit = 0
        let totalPassImgAudit = 0
        let totalHmeAudit = 0
        let totalPassHmeAudit = 0
        let totalElectricAudit = 0
        let totalPassElectricAudit = 0
                
        let totalCritValid = 0

        const sales_weight_per_installation= (element.installation_id.sales_weight_per_installation !== null)? element.installation_id.sales_weight_per_installation : 0
        const post_sale_weight_per_installation= (element.installation_id.post_sale_weight_per_installation !== null)? element.installation_id.post_sale_weight_per_installation : 0
    
        totalWeightPerc +=  sales_weight_per_installation + post_sale_weight_per_installation

        element.criterions.forEach((criterion) => {                
          let isValidType = false
          criterion.criterion_id.installationType.forEach((type) => {
            if(type._id.toString() === element.installation_id.installation_type._id.toString()){
              isValidType = true
            }
          })
          if(!(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
          criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
          criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
          criterion.criterion_id.exceptions.includes(element.installation_id._id) ||
          !isValidType)){
            totalCriterionsForInst += 1
            if(criterion.criterion_id.isImgAudit){
              totalImgAudit+= criterion.criterion_id.value
              if(criterion.pass)
                totalPassImgAudit+= criterion.criterion_id.value
            }
            else if(criterion.criterion_id.isHmeAudit){
              totalHmeAudit+= criterion.criterion_id.value
              if(criterion.pass)
                totalPassHmeAudit+= criterion.criterion_id.value
            }
            else if(criterion.criterion_id.isElectricAudit){
              totalElectricAudit+= criterion.criterion_id.value
              if(criterion.pass)
                totalPassElectricAudit+= criterion.criterion_id.value
            }
          }
        })
    
        element.criterions.forEach((criterion) => {
          let isValidType = false
          criterion.criterion_id.installationType.forEach((type) => {
            if(type._id.toString() === element.installation_id.installation_type._id.toString()){
              isValidType = true
            }
          })
          if(!(criterion.criterion_id.category._id.toString() === VENTA && !element.installation_id.isSale ||
          criterion.criterion_id.category._id.toString() === POSVENTA && !element.installation_id.isPostSale ||
          criterion.criterion_id.category._id.toString() === HYUNDAI_PROMISE && !element.installation_id.isHP || 
          criterion.criterion_id.exceptions.includes(element.installation_id._id) ||
          !isValidType)){

            if(actualCategoryID.length === 0){
              actualCategoryID = criterion.criterion_id.category._id.toString()
              actualCategoryName = criterion.criterion_id.category.name.toString()
            }

            let multiplicator = 1
    
            if(actualCategoryID === VENTA){
              if(element.installation_id.sales_weight_per_installation !== null){
                multiplicator = element.installation_id.sales_weight_per_installation/100
              }
              else{
                multiplicator = 1
              }
            }
            else if(actualCategoryID === POSVENTA){
              if(element.installation_id.post_sale_weight_per_installation !== null){
                multiplicator = element.installation_id.post_sale_weight_per_installation/100
              }
              else{
                multiplicator = 1
              }
            }
            else{
              multiplicator = 1
            }
    
            totalCritValid += 1
    
            if((criterion.criterion_id.category._id.toString() === actualCategoryID)){
              totalCriterionsByCat += 1
              if(criterion.pass){
                accum += criterion.criterion_id.value
              }
              totalAccum += criterion.criterion_id.value
              if(totalCritValid === totalCriterionsForInst){
                const perc = ((accum * 100)/totalAccum) * multiplicator
                const category = {
                  id: actualCategoryID.toString(),
                  name: actualCategoryName,
                  pass: accum,
                  total: totalAccum,
                  percentageByInstallation: (accum * 100)/totalAccum,
                  totalCriterionsByCat: totalCriterionsByCat,
                  percentage: perc,
                }
                categories = [...categories, category]
    
                let totalResult = 0
                if(categories.length>0){
                  categories.forEach((category) => {
                    totalResult += (category.pass * 100)/category.total
                    const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                    category['totalCriterionsPercByCat'] = percByCrit * category.percentage / 100
                  })
                }
                else if(totalCriterionsForInst>0){
                  totalResult = 1
                  const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                  categoriesAux['totalCriterionsPercByCat'] = percByCrit * categoriesAux.percentage / 100
                  categories = [...categories, categoriesAux]
                }
                                
                const auditTotalResult = totalResult / categories.length
                categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]
    
                installationAuditData['categories'] = categories
    
                instalation_audit_types = {
                  percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                  percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                  percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                }
    
                installationAuditData['instalation_audit_types'] =  instalation_audit_types
    
                instalations_audit_details = [...instalations_audit_details, installationAuditData]
              }
            }
            else{
              if(totalCritValid !== 1 || totalCriterionsForInst === 1){
                const perc = ((accum * 100)/totalAccum) * multiplicator
                const category = {
                  id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
                  name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
                  pass: accum,
                  total: totalAccum,
                  percentageByInstallation: (accum * 100)/totalAccum,
                  totalCriterionsByCat: totalCriterionsByCat,
                  percentage: perc,
                }
                categories = [...categories, category]
              }
              totalCriterionsByCat = 1
              totalAccum = criterion.criterion_id.value
              if(criterion.pass){
                accum = criterion.criterion_id.value
              }
              else{
                accum = 0
              }
              actualCategoryID = criterion.criterion_id.category._id.toString()
              actualCategoryName = criterion.criterion_id.category.name.toString()
              if(totalCritValid === totalCriterionsForInst && totalCriterionsForInst !== 1){
                const perc = ((accum * 100)/totalAccum) * multiplicator
                const category = {
                  id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
                  name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
                  pass: accum,
                  total: totalAccum,
                  percentageByInstallation: (accum * 100)/totalAccum,
                  totalCriterionsByCat: totalCriterionsByCat,
                  percentage: perc,
                }
                categories = [...categories, category]
                let totalResult = 0
                if(categories.length>0){
                  categories.forEach((category) => {
                    totalResult += (category.pass * 100)/category.total
                    const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                    category['totalCriterionsPercByCat'] = percByCrit * category.percentage / 100
                  })
                }
                else if(totalCriterionsForInst>0){
                  totalResult = 1
                  const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
                  categoriesAux['totalCriterionsPercByCat'] = percByCrit * categoriesAux.percentage / 100
                  categories = [...categories, categoriesAux]
                }
    
                const auditTotalResult = totalResult / categories.length
                categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]
    
                installationAuditData['categories'] = categories
    
                instalation_audit_types = {
                  percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
                  percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
                  percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
                }
    
                installationAuditData['instalation_audit_types'] =  instalation_audit_types
    
                instalations_audit_details = [...instalations_audit_details, installationAuditData]
              }
            }
          }      
        })
      })
    
      let hp_perc = 0
      let general_perc = 0
      let v_perc = 0
      let pv_perc = 0
      let hp_perc_total = 0
      let general_perc_total = 0
      let v_perc_total = 0
      let pv_perc_total = 0
            
      let electric_total = 0
      let electric_perc = 0
      let img_total = 0
      let img_perc = 0
      let hme_total = 0
      let hme_perc = 0

      let total_values = 0

      instalations_audit_details.forEach((installation) => {
        if(installation && installation.categories){
          const sales_weight_per_installation= (installation.installation.sales_weight_per_installation !== null)? installation.installation.sales_weight_per_installation : 0
          const post_sale_weight_per_installation= (installation.installation.post_sale_weight_per_installation !== null)? installation.installation.post_sale_weight_per_installation : 0
          let accumTotalWeightPerc = sales_weight_per_installation + post_sale_weight_per_installation
          const coefficient = ((accumTotalWeightPerc * 100) / totalWeightPerc)/100

          installation.categories.forEach((category) => {
            if(category.id === HYUNDAI_PROMISE){
              hp_perc_total += 1
              hp_perc += category.pass * coefficient
              total_values += category.total * coefficient
            }
            else if(category.id === GENERAL){
              general_perc_total += 1
              general_perc += category.pass * coefficient
              total_values += category.total * coefficient
            }
            else if(category.id === VENTA){
              v_perc_total += 1
              v_perc += category.pass * coefficient
              total_values += category.total * coefficient
            }
            else if(category.id === POSVENTA){
              pv_perc_total += 1
              pv_perc += category.pass * coefficient
              total_values += category.total * coefficient
            }
          })
    
        }
    
        if(installation && installation.instalation_audit_types){
          if(installation.instalation_audit_types.percImgAudit !== null){
            img_perc+= installation.instalation_audit_types.percImgAudit
            img_total+= 1
          }
          if(installation.instalation_audit_types.percElectricAudit !== null){
            electric_perc+= installation.instalation_audit_types.percElectricAudit
            electric_total+= 1
          }
          if(installation.instalation_audit_types.percHmeAudit !== null){
            hme_perc+= installation.instalation_audit_types.percHmeAudit
            hme_total+= 1
          }
        }
      })

      let agency_by_types = {
        electric_perc: (electric_total === 0)? null: electric_perc / electric_total,
        img_perc: (img_total === 0)? null: img_perc / img_total,
        hme_perc: (hme_total === 0)? null: hme_perc / hme_total,
    
        hp_perc: (hp_perc_total === 0)? null: hp_perc * 100 / total_values,
        v_perc: (v_perc_total === 0)? null: v_perc * 100 / total_values,
        general_perc: (general_perc_total === 0)? null: general_perc * 100 / total_values,
        pv_perc: (pv_perc_total === 0)? null: pv_perc * 100 / total_values
      }

      const total_agency = (agency_by_types.hp_perc !== null? agency_by_types.hp_perc: 0) + (agency_by_types.v_perc !== null? agency_by_types.v_perc: 0) + (agency_by_types.general_perc !== null? agency_by_types.general_perc: 0) + (agency_by_types.pv_perc !== null? agency_by_types.pv_perc: 0) 

      agency_by_types['total_agency'] = total_agency
        
      let data = {
        code: dealershipByID.code,
        name: dealershipByID.name,
        ionic5_quaterly_billing: dealershipByID.ionic5_quaterly_billing,
        vn_quaterly_billing: dealershipByID.vn_quaterly_billing,
        electric_quaterly_billing: dealershipByID.electric_quaterly_billing,
        percentage_total: agency_by_types.total_agency,
        percentage_general: agency_by_types.general_perc,
        percentage_venta: agency_by_types.v_perc,
        percentage_postventa: agency_by_types.pv_perc,
        percentage_HP: agency_by_types.hp_perc,
        percentage_audit_electric: agency_by_types.electric_perc,
        percentage_audit_img: agency_by_types.img_perc,
        percentage_audit_hme: agency_by_types.hme_perc,
      }

      compliance_audit += agency_by_types.total_agency !== null? agency_by_types.total_agency : 0

      arrayDealershipsAudit = [...arrayDealershipsAudit, data]
    }

    const audit_data = {
      name: existAudit.name,
      initial_date: existAudit.initial_date,
      end_date: existAudit.end_date,
      compliance_audit: compliance_audit/arrayOfDealerships.length,
      dealership_details: arrayDealershipsAudit
    }

    return response.status(200).json({data: audit_data})
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getAuditResByAuditIDAndInstallationID = async(request, response) => {
  try{
    const {auditid, installationid} = request.params

    if(!auditid)
      return response.status(400).json({code: 400,
        msg: 'invalid auditid',
        detail: 'id is a obligatory field'})
    if(auditid && !ObjectId.isValid(auditid))
      return response.status(400).json({code: 400,
        msg: 'invalid auditid',
        detail: 'auditid should be an objectId'})

    if(!installationid)
      return response.status(400).json({code: 400,
        msg: 'invalid installationid',
        detail: 'id is a obligatory field'})
    if(installationid && !ObjectId.isValid(installationid))
      return response.status(400).json({code: 400,
        msg: 'invalid installationid',
        detail: 'installationid should be an objectId'})
    
    let auditRes = await AuditResults.findOne({audit_id: auditid, installation_id: {$in: [installationid]}})
      .populate({path: 'criterions.discussion.user', select: '_id names surnames emailAddress role'})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const adminForAudit = await Admin.find({'audits.audit': auditid, 'audits.dealerships.installations': installationid}, 'names surnames emailAddress userName role dealership _id')

    if(auditRes){
      response.status(200).json({code: 200,
        msg: 'success',
        data: auditRes,
        auditors: adminForAudit     
      })
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

const getAuditResByAuditID = async(request, response) => {
  try{
    const {auditid} = request.params

    if(!auditid)
      return response.status(400).json({code: 400,
        msg: 'invalid auditid',
        detail: 'id is a obligatory field'})
    if(auditid && !ObjectId.isValid(auditid))
      return response.status(400).json({code: 400,
        msg: 'invalid auditid',
        detail: 'auditid should be an objectId'})
    
    const auditRes = await AuditResults.find({audit_id: auditid}, 'audit_id installation_id dateForAudit')
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    let arrayOfInstallations = []

    const adminForAudit = await Admin.find({'audits.audit': auditid}, 'names surnames emailAddress userName role dealership _id audits')

    for(let i = 0; i < auditRes.length; i++){
           
      let auditors = []
      let adminFind = false

      adminForAudit.forEach((admin) => {
        admin.audits.forEach((audit) => {
          audit.dealerships.forEach((el) => {
            const ex = el.installations.includes(auditRes[i].installation_id.toString())
            if(ex){
              adminFind = true
            }
          })
        })
        if(adminFind){
          auditors = [...auditors, admin]
        }
      })

      const installationEl = {
        installation_id: auditRes[i].installation_id,
        auditors: auditors,
        dateForAudit: auditRes[i].dateForAudit
      }
           
      arrayOfInstallations = [...arrayOfInstallations, installationEl]
    }
        
    if(auditRes){
      response.status(200).json({code: 200,
        msg: 'success',
        data: arrayOfInstallations})
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

const updateAuditResults = async(request, response) => {
  try{
    const {audit_id, installation_id, criterions, state} = request.body
    const {id} = request.params

    let errors = []
    let audiResultstById = null

    if(id && ObjectId.isValid(id)){
      audiResultstById = await AuditResults.findById(id)
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error id',
          detail: error.message
        })} )  
      if(!audiResultstById)
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

    if(audit_id){
      if(!ObjectId.isValid(audit_id)){
        errors.push({code: 400, 
          msg: 'invalid audit_id',
          detail: `${audit_id} is not an ObjectId`
        })  
      }
      else{
        const existAudit = await Audit.exists({_id: audit_id})
        if(!existAudit)
          errors.push({code: 400, 
            msg: 'invalid audit_id',
            detail: `${audit_id} not found`
          })   
      }
    }

    if(installation_id){
      if(!ObjectId.isValid(installation_id)){
        errors.push({code: 400, 
          msg: 'invalid installation_id',
          detail: `${installation_id} is not an ObjectId`
        })  
      }
      else{
        const existInstallation = await Installation.exists({_id: installation_id})
        if(!existInstallation)
          errors.push({code: 400, 
            msg: 'invalid installation_id',
            detail: `${installation_id} not found`
          })   
      }
    }

    if(criterions){
      criterions.forEach(async(element) => {
        if(!element.hasOwnProperty('criterion_id') || !element.hasOwnProperty('pass')){
          errors.push({code: 400, 
            msg: 'invalid criterions',
            detail: 'criterions should be contains criterion_id and pass fields'
          })
        }
        else if(!ObjectId.isValid(element.criterion_id)){
          errors.push({code: 400, 
            msg: 'invalid criterion_id',
            detail: `${element.criterion_id} is not an ObjectId`
          })  
        }
        else{                
          const existCriterion = await Criterion.exists({_id: element.criterion_id})
          if(!existCriterion)
            errors.push({code: 400, 
              msg: 'invalid criterion_id',
              detail: `${element.criterion_id} not found`
            })        
        }
      })
    }

    if(state !== null && state !== undefined && state !== 'created' && state !== 'canceled' && state !== 'planned' &&
            state !== 'in_process' && state !== 'auditor_signed' && state !== 'auditor_end' && state !== 'closed' ){
      errors.push({code: 400, 
        msg: 'invalid status',
        detail: 'status should be created, canceled, planned, in_process, auditor_signed, auditor_end, or closed'
      })  
    }
        
    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const updatedFields = {}

    if(audit_id)
      updatedFields['audit_id'] = audit_id
    if(installation_id)
      updatedFields['installation_id'] = installation_id
    if(criterions)
      updatedFields['criterions'] = criterions
    if(state)
      updatedFields['state'] = state
    updatedFields['updatedAt'] = Date.now()

    const updatedAuditResults = await AuditResults.findByIdAndUpdate(id, updatedFields, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    response.status(200).json({code: 200,
      msg: 'the AuditResults has been updated successfully',
      data: updatedAuditResults })
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const createAuditResultsTest = async(request, response) => {
  try{
    const {audit_id, installation_id, criterions} = request.body
    let errors = []
    let arrayInstallations = []
    let array_instalations_audit_details = []
    let existInstallation = null
    let existAudit = null
    let dealershipByID = null

    if(!ObjectId.isValid(audit_id)){
      errors.push({code: 400, 
        msg: 'invalid audit_id',
        detail: `${audit_id} is not an ObjectId`
      })  
    }
    else{
      existAudit = await Audit.findById(audit_id)
      if(!existAudit){
        errors.push({code: 400, 
          msg: 'invalid audit_id',
          detail: `${audit_id} not found`
        })  
      } else {
        const auditResultsFind = await AuditResults.findOne({audit_id: audit_id, installation_id: installation_id})
        if(auditResultsFind)
          errors.push({code: 400, 
            msg: 'invalid installation_id',
            detail: 'installation_id has already been audited'
          })
      }
    }

    if(!criterions || !Array.isArray(criterions)){
      errors.push({code: 400, 
        msg: 'invalid criterions',
        detail: 'criterions is an obligatory field, and should be an array type'
      })
    }
    else if(criterions){

      criterions.forEach(async(element) => {
        if(!element.hasOwnProperty('criterion_id') || !element.hasOwnProperty('pass')){
          errors.push({code: 400, 
            msg: 'invalid criterions',
            detail: 'criterions should be contains criterion_id and pass fields'
          })
        }
        else if(!ObjectId.isValid(element.criterion_id)){
          errors.push({code: 400, 
            msg: 'invalid criterion_id',
            detail: `${element.criterion_id} is not an ObjectId`
          })  
        }
        else{                
          const existCriterion = await Criterion.exists({_id: element.criterion_id})
          if(!existCriterion)
            errors.push({code: 400, 
              msg: 'invalid criterion_id',
              detail: `${element.criterion_id} not found`
            })        
        }
      })
    }

    if(!installation_id){
      errors.push({code: 400, 
        msg: 'invalid installation_id',
        detail: 'installation_id is an obligatory field'
      })
    }
    else{
      if(!ObjectId.isValid(installation_id)){
        errors.push({code: 400, 
          msg: 'invalid installation_id',
          detail: `${installation_id} is not an ObjectId`
        })  
      }
      else{
        existInstallation = await Installation.findOne({_id: installation_id}).populate({
          path: 'installation_type dealership', 
          select: '_id code active'})

        if(!existInstallation || !existInstallation.active){
          errors.push({code: 400, 
            msg: 'invalid installation_id',
            detail: `${installation_id} not found`
          })}
        else{
          dealershipByID = await Dealership.findById(existInstallation.dealership)

          for(let i = 0; i < dealershipByID.installations.length; i++){
            const inst = await Installation.findById(dealershipByID.installations[i])
            if(dealershipByID.installations[i].toString() !== installation_id && inst?.active){
              arrayInstallations = [...arrayInstallations, dealershipByID.installations[i]]
            }
          }
        }
      }
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const newAuditResults = await (await ((new AuditResults({
      audit_id,
      installation_id,
      criterions,
      state: 'created'
    })).populate({
      path: 'installation_id', 
      select: '_id active name code installation_type dealership sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
      populate: {
        path: 'installation_type dealership', 
        select: '_id code active'}
    })))
      .populate({ path: 'criterions.criterion_id', 
        populate: {
          path: 'standard block area category auditResponsable criterionType installationType',
          select: 'name code description isCore number abbreviation categoryType'
        },
      }) 

    let auditsResults = await AuditResults.find({$and:[{installation_id: {$in: arrayInstallations}},{audit_id: audit_id}]})
      .populate({path: 'installation_id', select: '_id active name code installation_type dealership sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
        populate: {path: 'installation_type dealership', select: '_id code active'}})
      .populate({ path: 'criterions.criterion_id', 
        populate: {
          path: 'standard block area category auditResponsable criterionType installationType',
          select: 'name code description isCore number abbreviation categoryType'
        },
      }) 
                             
    let auditsResultsWithout = await AuditResults.find({$and:[{installation_id: {$in: arrayInstallations}},{audit_id: audit_id}]})
      .populate({path: 'installation_id', select: '_id active name code installation_type dealership sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
        populate: {path: 'installation_type dealership', select: '_id code active'}})

    //Recorro el arreglo de resultados
    let arrayStandardsFalse = []
    let arrayAreasFalse = []

    const auditResultsForImgAndHme = newAuditResults

    newAuditResults.criterions.forEach((criterion) => {
      if(!criterion.pass && !criterion.criterion_id.exceptions.includes(newAuditResults.installation_id._id)){
        const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
        if(!existStandard){
          arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
        }
        if(criterion.criterion_id.standard.isCore){
          const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
          if(!existArea){
            arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
          }
        }
      }
    })

    if(existAudit?.isCustomAudit){
      arrayStandardsFalse = []
      arrayAreasFalse = []
    }

    let instalations_audit_details = []
    let instalation_audit_types = null

    const VENTA = '6233b3ace74b428c2dcf3068'
    const POSVENTA = '6233b450e74b428c2dcf3091'
    const HYUNDAI_PROMISE = '6233b445e74b428c2dcf3088'
    const GENERAL = '6233b39fe74b428c2dcf305f'

    let totalWeightPerc = 0

    let totalImgAudit = 0
    let totalPassImgAudit = 0
    let totalHmeAudit = 0
    let totalHmeAuditAux = 0
    let totalPassHmeAudit = 0
    let totalPassHmeAuditAux = 0

    //<<<NUEVO
    auditResultsForImgAndHme.criterions.forEach((criterion) => {     
      let isValidType = false
      criterion.criterion_id.installationType.forEach((type) => {
        if(type._id.toString() === newAuditResults.installation_id.installation_type._id.toString()){
          isValidType = true
        }
      })
      // Si es inválido
      if(!(criterion.criterion_id.category.categoryType?.toString() === 'VN' && !newAuditResults.installation_id.isSale ||
      criterion.criterion_id.category.categoryType?.toString() === 'PV' && !newAuditResults.installation_id.isPostSale ||
      criterion.criterion_id.category.categoryType?.toString() === 'HP' && !newAuditResults.installation_id.isHP ||
      criterion.criterion_id.exceptions.includes(newAuditResults.installation_id._id) ||
      !isValidType)){ 
        if(criterion.criterion_id.isImgAudit){
          // Peso total de los criterios imgAudit que aplican
          if(criterion.criterion_id.isHmeAudit){
            totalImgAudit += criterion.criterion_id.value
          } else{
            totalImgAudit += criterion.criterion_id.value
          }
          if(criterion.pass)
            if(criterion.criterion_id.isHmeAudit){
              totalPassImgAudit += criterion.criterion_id.value
            } else{
              totalPassImgAudit += criterion.criterion_id.value
            }
          // Peso total de los criterios imgAudit que aplican
        }
        if(criterion.criterion_id.isHmeAudit){
          // Peso total de los criterios hmes que aplican
          if(criterion.criterion_id.isHmeAudit){
            totalHmeAudit += criterion.criterion_id.value
            totalHmeAuditAux += 1
          } else{
            totalHmeAudit += criterion.criterion_id.value
          }
          if(criterion.pass)
            if(criterion.criterion_id.isHmeAudit){
              totalPassHmeAudit += criterion.criterion_id.value
              totalPassHmeAuditAux += 1
            } else{
              totalPassHmeAudit += criterion.criterion_id.value
            }
          // Peso total de los criterios hmes que aplican
        }
      }
    })
    //>>>

    //Convierto en false los criterios afectados por core
    if(!existAudit?.isCustomAudit){
      newAuditResults.criterions.forEach((criterion, index) => {
        const existSt = arrayStandardsFalse.includes(criterion.criterion_id.standard.toString())
        const existAr = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
        if(existAr || existSt){
          //Pongo en false los criterios afectados por el core
          newAuditResults.criterions[index].pass = false
        }
      })
    }
    //Ordeno el arreglo por standard id
    newAuditResults.criterions.sort(function (a, b) {
      if (a.criterion_id.standard._id.toString() > b.criterion_id.standard._id.toString()) {
        return 1
      }
      if (a.criterion_id.standard._id.toString() < b.criterion_id.standard._id.toString()) {
        return -1
      }
      return 0
    })

    let installationAuditData = {}
    installationAuditData['installation'] =  newAuditResults.installation_id
    let actualCategoryID = ''
    let actualCategoryName = ''
    let accum = 0
    let totalAccum = 0
    let totalCriterionsByCat = 0
    let categories = []
    let totalCriterionsForInst = 0
    let categoriesAux = null
    let totalElectricAudit = 0
    let totalPassElectricAudit = 0
    let totalCritValid = 0
    let totalCriterionWeight = 0

    const sales_weight_per_installation= (newAuditResults.installation_id.sales_weight_per_installation !== null)? newAuditResults.installation_id.sales_weight_per_installation : 0
    const post_sale_weight_per_installation= (newAuditResults.installation_id.post_sale_weight_per_installation !== null)? newAuditResults.installation_id.post_sale_weight_per_installation : 0

    // Es la sumatoria de los pesos de cada instalación
    totalWeightPerc +=  sales_weight_per_installation + post_sale_weight_per_installation

    // Criterios electricos, hme, img
    newAuditResults.criterions.forEach((criterion) => {     
      let isValidType = false
      criterion.criterion_id.installationType.forEach((type) => {
        if(type._id.toString() === newAuditResults.installation_id.installation_type._id.toString()){
          isValidType = true
        }
      })

      // Si es inválido
      if(!(criterion.criterion_id.category.categoryType?.toString() === 'VN' && !newAuditResults.installation_id.isSale ||
      criterion.criterion_id.category.categoryType?.toString() === 'PV' && !newAuditResults.installation_id.isPostSale ||
      criterion.criterion_id.category.categoryType?.toString() === 'HP' && !newAuditResults.installation_id.isHP ||
      criterion.criterion_id.exceptions.includes(newAuditResults.installation_id._id) ||
      !isValidType)){ 
        // Peso total de los criterios que aplican
        if(criterion.criterion_id.isHmeAudit){
          totalCriterionWeight += criterion.criterion_id.value
        } else{
          totalCriterionWeight += criterion.criterion_id.value
        }
        // Cantidad de criterios que aplican para esa instalación
        totalCriterionsForInst += 1
        if(criterion.criterion_id.isElectricAudit){
          // Peso total de los criterios Electric que aplican
          if(criterion.criterion_id.isHmeAudit){
            totalElectricAudit += criterion.criterion_id.value
          } else{
            totalElectricAudit += criterion.criterion_id.value
          }
          if(criterion.pass)
            if(criterion.criterion_id.isHmeAudit){
              totalPassElectricAudit += criterion.criterion_id.value
            } else{
              totalPassElectricAudit += criterion.criterion_id.value
            }
          // Peso total de los criterios hmes que aplican
        }
      }
    })

    // Los demás criterios
    newAuditResults.criterions.forEach((criterion) => {
      let isValidType = false
      criterion.criterion_id.installationType.forEach((type) => {
        if(type._id.toString() === newAuditResults.installation_id.installation_type._id.toString()){
          isValidType = true
        }
      })
      // El criterio no aplica
      if(!(criterion.criterion_id.category.categoryType?.toString() === 'VN' && !newAuditResults.installation_id.isSale ||
      criterion.criterion_id.category.categoryType?.toString() === 'PV' && !newAuditResults.installation_id.isPostSale ||
      criterion.criterion_id.category.categoryType?.toString() === 'HP' && !newAuditResults.installation_id.isHP || 
      criterion.criterion_id.exceptions.includes(newAuditResults.installation_id._id) ||
      !isValidType))
      {
        // Si actualCategoryID es igual a '', entonces le asigno el categoryID actual
        if(actualCategoryID.length === 0){
          actualCategoryID = criterion.criterion_id.category._id.toString()
          actualCategoryName = criterion.criterion_id.category.name.toString()
        }

        // Defino el multiplicador
        let multiplicator = 1
        if(actualCategoryID === VENTA){
          if(newAuditResults.installation_id.sales_weight_per_installation !== null){
            multiplicator = newAuditResults.installation_id.sales_weight_per_installation/100
          }
          else{
            multiplicator = 1
          }
        }
        else if(actualCategoryID === POSVENTA){
          if(newAuditResults.installation_id.post_sale_weight_per_installation !== null){
            multiplicator = newAuditResults.installation_id.post_sale_weight_per_installation/100
          }
          else{
            multiplicator = 1
          }
        }
        else{
          multiplicator = 1
        }

        totalCritValid += 1
        //Si la categoría actual es igual que la anterior
        if((criterion.criterion_id.category._id.toString() === actualCategoryID)){
          //Cantidad de criterios para esta categoría
          totalCriterionsByCat += 1
          if(criterion.pass){
            //Cantidad de peso acumulado de los cumplidos
            if(criterion.criterion_id.isHmeAudit){
              accum += criterion.criterion_id.value
            } else{
              accum += criterion.criterion_id.value
            }
          }
          //Cantidad acumulada de peso total para esa categoría
          if(criterion.criterion_id.isHmeAudit){
            totalAccum += criterion.criterion_id.value
          } else{
            totalAccum += criterion.criterion_id.value
          }
          // Si la cantidad recorrida de criterios en esta instalación, es igual al total de criterios que tiene esa instalación
          // Entonces guarda la categoría en el arreglo de categorias de esa instalación.
          if(totalCritValid === totalCriterionsForInst){
            const perc = ((accum * 100)/totalAccum) * multiplicator
            const category = {
              id: actualCategoryID.toString(),
              name: actualCategoryName,
              pass: accum,
              total: totalAccum,
              percentageByInstallation: (accum * 100)/totalAccum,
              totalCriterionsByCat: totalCriterionsByCat,
              percentage: perc,
              partialPercentage: (accum * 100) / totalCriterionWeight
            }

            categories = [...categories, category]

            let newTotal = 0

            if(categories.length>0){
              categories.forEach((category) => {
                newTotal += category.partialPercentage
                const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                category['totalCriterionsPercByCat'] = percByCrit * category.percentage / 100
              })
            }
            else if(totalCriterionsForInst>0){
              const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
              categoriesAux['totalCriterionsPercByCat'] = percByCrit * categoriesAux.percentage / 100
              categories = [...categories, categoriesAux]
            }
                        
            const auditTotalResult = newTotal 
            categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]
            installationAuditData['categories'] = categories
            instalation_audit_types = {
              percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
              percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
              percHmeAuditAux: totalHmeAuditAux === 0? null: (totalPassHmeAuditAux * 100)/totalHmeAuditAux,
              percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
            }

            installationAuditData['instalation_audit_types'] =  instalation_audit_types
            installationAuditData['installation'] =  existInstallation
            installationAuditData['totalWeightPerc'] = totalWeightPerc
            instalations_audit_details = installationAuditData
          }
        }
        //Si la categoría actual es diferente que la anterior
        else{
          // Si no es el primer elemento del arreglo de criterios que aplican, o si tiene solo uno, lo guarda en el arreglo de categorias
          if(totalCritValid !== 1 || totalCriterionsForInst === 1){
            const perc = ((accum * 100)/totalAccum) * multiplicator
            const category = {
              id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
              name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
              pass: accum,
              total: totalAccum,
              percentageByInstallation: (accum * 100)/totalAccum,
              totalCriterionsByCat: totalCriterionsByCat,
              percentage: perc,
              partialPercentage: (accum * 100) / totalCriterionWeight
            }
            categories = [...categories, category]
          }
          totalCriterionsByCat = 1
          if(criterion.criterion_id.isHmeAudit){
            totalAccum = criterion.criterion_id.value
          } else{
            totalAccum = criterion.criterion_id.value
          }
          if(criterion.pass){
            if(criterion.criterion_id.isHmeAudit){
              accum = criterion.criterion_id.value
            } else{
              accum = criterion.criterion_id.value
            }
          }
          else{
            accum = 0
          }
          actualCategoryID = criterion.criterion_id.category._id.toString()
          actualCategoryName = criterion.criterion_id.category.name

          // Si estoy recorriendo el último elemento, entonces lo almaceno
          if(totalCritValid === totalCriterionsForInst && totalCriterionsForInst !== 1){
            const perc = ((accum * 100)/totalAccum) * multiplicator
            const category = {
              id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
              name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
              pass: accum,
              total: totalAccum,
              percentageByInstallation: (accum * 100)/totalAccum,
              totalCriterionsByCat: totalCriterionsByCat,
              percentage: perc,
              partialPercentage: (accum * 100) / totalCriterionWeight
            }
            categories = [...categories, category]

            let newTotal = 0
            if(categories.length>0){
              categories.forEach((category) => {
                newTotal += category.partialPercentage
                const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                category['totalCriterionsPercByCat'] = percByCrit * category.percentage / 100
              })
            }
            else if(totalCriterionsForInst>0){
              const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
              categoriesAux['totalCriterionsPercByCat'] = percByCrit * categoriesAux.percentage / 100
              categories = [...categories, categoriesAux]
            }
            const auditTotalResult = newTotal
            categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

            installationAuditData['categories'] = categories

            instalation_audit_types = {
              percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
              percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
              percHmeAuditAux: totalHmeAuditAux === 0? null: (totalPassHmeAuditAux * 100)/totalHmeAuditAux,
              percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
            }

            installationAuditData['installation'] =  existInstallation
            installationAuditData['totalWeightPerc'] = totalWeightPerc
            installationAuditData['instalation_audit_types'] = instalation_audit_types

            instalations_audit_details = [...instalations_audit_details, installationAuditData]

          }
        }
      }      
    })

    auditsResults.forEach((auditres) => {
      auditres.instalations_audit_details.forEach((element) => {
        totalWeightPerc += element.totalWeightPerc
        array_instalations_audit_details = [...array_instalations_audit_details, element]
      })
    })

    array_instalations_audit_details = [...array_instalations_audit_details, instalations_audit_details]
    let accumAgency = 0

    let hp_perc = 0
    let general_perc = 0
    let v_perc = 0
    let pv_perc = 0
        
    let electric_total = 0
    let electric_perc = 0
    let img_total = 0
    let img_perc = 0
    let hme_total = 0
    let hme_perc_aux = 0
    let agency_by_types_customs = []
    let agency_by_types_customs_total = []
        
    let maxCategories = 0
    let cantInst = 0
        
    array_instalations_audit_details.forEach((installation) => {
      cantInst += 1
      if(installation?.categories?.length - 1 > maxCategories){
        maxCategories = (installation.categories.length - 1)
      }
    })

    array_instalations_audit_details.forEach((installation) => {
      if(Array.isArray(installation)){
        installation = installation[0]
      }

      if(installation && installation.categories){
        const sales_weight_per_installation= (installation.installation.sales_weight_per_installation !== null)? installation.installation.sales_weight_per_installation : 0
        const post_sale_weight_per_installation= (installation.installation.post_sale_weight_per_installation !== null)? installation.installation.post_sale_weight_per_installation : 0
        let accumTotalWeightPerc = sales_weight_per_installation + post_sale_weight_per_installation
        const coefficient = ((accumTotalWeightPerc * 100) / totalWeightPerc)/100

        accumAgency += installation.categories[installation.categories.length - 1].auditTotalResult
        installation.categories.forEach((category) => {
          if(category.id === HYUNDAI_PROMISE){
            hp_perc += category.partialPercentage * coefficient
          }
          else if(category.id === GENERAL){
            general_perc += category.partialPercentage * coefficient
          }
          else if(category.id === VENTA){
            v_perc += category.partialPercentage * coefficient
          }
          else if(category.id === POSVENTA){
            pv_perc += category.partialPercentage * coefficient
          }
          else{
            const nameCategory = category.name
            const promedioCategory = category.partialPercentage
            const indexFinded = agency_by_types_customs.findIndex((el) => el.nameCategory === nameCategory)
            if(indexFinded >= 0){
              agency_by_types_customs_total[indexFinded].total = agency_by_types_customs_total[indexFinded].total + 1
              agency_by_types_customs[indexFinded].promedioCategory = agency_by_types_customs[indexFinded].promedioCategory + promedioCategory
            }
            else{
              agency_by_types_customs_total = [...agency_by_types_customs_total, {nameCategory: nameCategory, total: 1}]
              agency_by_types_customs = [...agency_by_types_customs, {nameCategory: nameCategory, promedioCategory: promedioCategory}]
            }
          }
        })
      }

      if(installation && installation.instalation_audit_types){
        if(installation.instalation_audit_types.percImgAudit !== null){
          img_perc+= installation.instalation_audit_types.percImgAudit
          img_total+= 1
        }
        if(installation.instalation_audit_types.percElectricAudit !== null){
          electric_perc+= installation.instalation_audit_types.percElectricAudit
          electric_total+= 1
        }
        if(installation.instalation_audit_types.percHmeAudit !== null){
          hme_perc_aux+= installation.instalation_audit_types.percHmeAuditAux
          hme_total+= 1
        }
      }
    })
        
    let agency_by_types = {
      electric_perc: (electric_total === 0)? null: electric_perc / electric_total,
      img_perc: (img_total === 0)? null: img_perc / img_total,
      hme_perc: (hme_total === 0)? null : hme_perc_aux / hme_total,
      hp_perc: (hp_perc === 0)? null: hp_perc,
      v_perc: (v_perc === 0)? null: v_perc,
      general_perc: (general_perc === 0)? null: general_perc,
      pv_perc: (pv_perc === 0)? null: pv_perc
    }

    if(existAudit?.isCustomAudit){
      agency_by_types_customs.forEach((element, index) => {
        agency_by_types_customs[index].promedioCategory = agency_by_types_customs[index].promedioCategory / cantInst 
      })
    }

    let indexDelEl = -1

    agency_by_types_customs.forEach((el, index) => {
      if(el.nameCategory === undefined || el.nameCategory === null || el.promedioCategory === NaN){
        indexDelEl = index
      }
    })

    if(indexDelEl > -1){
      agency_by_types_customs.splice(indexDelEl, 1)
    } else{
      agency_by_types_customs.pop()
    }
        
    agency_by_types['agency_by_types_customs'] = agency_by_types_customs

    let total_agency = 0

    if(!existAudit?.isCustomAudit){
      total_agency = (agency_by_types.hp_perc !== null? agency_by_types.hp_perc: 0) + (agency_by_types.v_perc !== null? agency_by_types.v_perc: 0) + (agency_by_types.general_perc !== null? agency_by_types.general_perc: 0) + (agency_by_types.pv_perc !== null? agency_by_types.pv_perc: 0) 
    } else {
      agency_by_types_customs.forEach((element) => {
        total_agency += element.promedioCategory
      })
    }

    agency_by_types['total_agency'] = total_agency

    const agency_audit_details = accumAgency / array_instalations_audit_details.length
        
    const newAuditResultsGen = new AuditResults({
      audit_id,
      installation_id,
      criterions,
      instalations_audit_details: instalations_audit_details,
      state: 'created'
    })

    const newConsetionResult = new AuditAgency({
      audit_id: audit_id,
      dealership_id: dealershipByID._id,
      code: dealershipByID.code,
      name: dealershipByID.name,
      ionic5_quaterly_billing: dealershipByID.ionic5_quaterly_billing,
      vn_quaterly_billing: dealershipByID.vn_quaterly_billing,
      electric_quaterly_billing: dealershipByID.electric_quaterly_billing,
      audit_initial_date: existAudit.initial_date,
      audit_end_date: existAudit.end_date,
      audit_name: existAudit.name,
      dealership_details: dealershipByID,
      audit_criterions_details: newAuditResultsGen,
      instalations_audit_details: array_instalations_audit_details,
      agency_audit_details: agency_audit_details,
      agency_by_types: agency_by_types
    })
        
    const existAuditAgency = await AuditAgency.findOne({audit_id: audit_id, dealership_id: dealershipByID._id})

    const newAuditResultscreated = await newAuditResultsGen.save()
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    if(!existAuditAgency){
      await newConsetionResult.save()
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
    }
    else{
      const updateConsetionResult = {
        audit_id: audit_id,
        dealership_id: dealershipByID._id,
        code: dealershipByID.code,
        name: dealershipByID.name,
        ionic5_quaterly_billing: dealershipByID.ionic5_quaterly_billing,
        vn_quaterly_billing: dealershipByID.vn_quaterly_billing,
        audit_initial_date: existAudit.initial_date,
        audit_end_date: existAudit.end_date,
        dealership_details: dealershipByID,
        audit_criterions_details: [...auditsResultsWithout, newAuditResultsGen],
        instalations_audit_details: array_instalations_audit_details,
        agency_audit_details: agency_audit_details,
        agency_by_types: agency_by_types
      }

      await AuditAgency.findOneAndUpdate({audit_id: audit_id, dealership_id: dealershipByID._id}, updateConsetionResult, {new: true})
        .catch(error => {        
          return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
        })
    }
        
    response.status(201).json({code: 201,
      msg: 'the auditResults has been created successfully',
      data: newAuditResultscreated,
      tables: newConsetionResult })
  } catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const updateTest = async(request, response) => {
  try{
    const {audit_id, installation_id, criterions, state, dateForAudit} = request.body
    const {id} = request.params
    let errors = []
    let audiResultstById = null
    let arrayInstallations = []
    let array_instalations_audit_details = []
    let existInstallation = null
    let existAudit = null
    let dealershipByID = null

    if(id && ObjectId.isValid(id)){
      audiResultstById = await AuditResults.findById(id)
        .catch(error => {return response.status(400).json({code: 500, 
          msg: 'error id',
          detail: error.message
        })} )  
      if(!audiResultstById)
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

    if(audit_id){
      if(!ObjectId.isValid(audit_id)){
        errors.push({code: 400, 
          msg: 'invalid audit_id',
          detail: `${audit_id} is not an ObjectId`
        })  
      }
      else{
        existAudit = await Audit.findById(audit_id)
        if(!existAudit)
          errors.push({code: 400, 
            msg: 'invalid audit_id',
            detail: `${audit_id} not found`
          })   
      }
    }

    if(installation_id){
      if(!ObjectId.isValid(installation_id)){
        errors.push({code: 400, 
          msg: 'invalid installation_id',
          detail: `${installation_id} is not an ObjectId`
        })  
      }
      else{
        existInstallation = await Installation.findById(installation_id).populate({
          path: 'installation_type dealership', 
          select: '_id code active'})

        if(!existInstallation || !existInstallation.active){
          errors.push({code: 400, 
            msg: 'invalid installation_id',
            detail: `${installation_id} not found`
          })}
        else{
          dealershipByID = await Dealership.findById(existInstallation.dealership)
          for(let i = 0; i < dealershipByID.installations.length; i++){
            const inst = await Installation.findById(dealershipByID.installations[i])
            if(dealershipByID.installations[i].toString() !== installation_id && inst?.active){
              arrayInstallations = [...arrayInstallations, dealershipByID.installations[i]]
            }
          }
        }
      }
    }

    if(criterions){
      criterions.forEach(async(element) => {
        if(!element.hasOwnProperty('criterion_id') || !element.hasOwnProperty('pass')){
          errors.push({code: 400, 
            msg: 'invalid criterions',
            detail: 'criterions should be contains criterion_id and pass fields'
          })
        }
        else if(!ObjectId.isValid(element.criterion_id)){
          errors.push({code: 400, 
            msg: 'invalid criterion_id',
            detail: `${element.criterion_id} is not an ObjectId`
          })  
        }
        else{                
          const existCriterion = await Criterion.exists({_id: element.criterion_id})
          if(!existCriterion)
            errors.push({code: 400, 
              msg: 'invalid criterion_id',
              detail: `${element.criterion_id} not found`
            })        
        }

        if(element.discussion && Array.isArray(element.discussion)){
          element.discussion.forEach(async(discussion) => {
            if(!discussion.hasOwnProperty('text') || !discussion.hasOwnProperty('user')){
              errors.push({code: 400, 
                msg: 'invalid discussion',
                detail: 'discussion should be contains text and user fields'
              })
            }
            else if(!ObjectId.isValid(discussion.user)){
              errors.push({code: 400, 
                msg: 'invalid user',
                detail: `${discussion.user} is not an ObjectId`
              })  
            }
            else{                
              const existAdmin = await Admin.exists({_id: discussion.user})
              if(!existAdmin)
                errors.push({code: 400, 
                  msg: 'invalid user',
                  detail: `${discussion.user} not found`
                })        
            }
          })
        }
      })
    }        

    if(dateForAudit){
      const regexDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
      if(dateForAudit.match(regexDate)){
        errors.push({code: 400, 
          msg: 'invalid dateForAudit',
          detail: `${dateForAudit} is not a valid date`
        })  
      }
    }

    if(state !== null && state !== undefined && state !== 'created' && state !== 'canceled' && state !== 'planned' &&
            state !== 'in_process' && state !== 'auditor_signed' && state !== 'auditor_end' && state !== 'closed' ){
      errors.push({code: 400, 
        msg: 'invalid status',
        detail: 'status should be created, canceled, planned, in_process, auditor_signed, auditor_end, or closed'
      })  
    }

    if(errors.length > 0)
      return response.status(400).json({errors: errors})

    const tablesObjectRes = {
      audit_id: audit_id,
      dealership_id: dealershipByID._id,
      code: dealershipByID.code,
      name: dealershipByID.name,
      ionic5_quaterly_billing: dealershipByID.ionic5_quaterly_billing,
      vn_quaterly_billing: dealershipByID.vn_quaterly_billing,
      electric_quaterly_billing: dealershipByID.electric_quaterly_billing,
      audit_name: existAudit.name,
      audit_initial_date: existAudit.initial_date,
      audit_end_date: existAudit.end_date,
      dealership_details: dealershipByID
    }

    const auditResultsForUpdRes = await AuditResults.findById(id)
    const critIndexRes = auditResultsForUpdRes.criterions.findIndex(crit => crit.criterion_id.toString() == criterions[0].criterion_id)
    if(critIndexRes > -1){
      auditResultsForUpdRes.criterions[critIndexRes] = criterions[0]
    }

    const updatedObjectRes = {
      audit_id,
      createdAt: audiResultstById.createdAt,
      installation_id: existInstallation._id,
      state: audiResultstById.state,
      dateForAudit: audiResultstById.dateForInstallation,
      updatedAt: audiResultstById.updatedAt,
      _id: audiResultstById._id,
      criterions: auditResultsForUpdRes.criterions
    }

    response.status(200).json({code: 200,
      msg: 'the AuditResults has been updated successfully',
      data: updatedObjectRes,
      tables: tablesObjectRes })

    const findCrit = await AuditResults.findById(id)
    const critIndex = findCrit.criterions.findIndex(crit => crit.criterion_id.toString() == criterions[0].criterion_id)
    if(critIndex > -1){
      findCrit.criterions[critIndex] = criterions[0]
    }

    const newAuditResults = await (await ((new AuditResults({
      audit_id,
      installation_id,
      criterions: findCrit?.criterions || criterions,
      state: 'created'
    })).populate({
      path: 'installation_id', 
      select: '_id active name code installation_type dealership sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
      populate: {
        path: 'installation_type dealership', 
        select: '_id code active'}
    })))
      .populate({ path: 'criterions.criterion_id', 
        populate: {
          path: 'standard block area category auditResponsable criterionType installationType',
          select: 'name code description isCore number abbreviation categoryType'
        },
      }) 

    let auditsResults = await AuditResults.find({$and:[{installation_id: {$in: arrayInstallations}},{audit_id: audit_id}]})
      .populate({path: 'installation_id', select: '_id active name code installation_type dealership sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
        populate: {path: 'installation_type dealership', select: '_id code active'}})
      .populate({ path: 'criterions.criterion_id', 
        populate: {
          path: 'standard block area category auditResponsable criterionType installationType',
          select: 'name code description isCore number abbreviation categoryType'
        },
      }) 

    let auditsResultsWithout = await AuditResults.find({$and:[{installation_id: {$in: arrayInstallations}},{audit_id: audit_id}]})
      .populate({path: 'installation_id', select: '_id active name code installation_type dealership sales_weight_per_installation post_sale_weight_per_installation isSale isPostSale isHP', 
        populate: {path: 'installation_type dealership', select: '_id code active'}})

    //Recorro el arreglo de resultados
    let arrayStandardsFalse = []
    let arrayAreasFalse = []
    let arrayStandardsFalseForElectric = []
    let arrayAreasFalseForElectric = []
        
    newAuditResults.criterions.forEach((criterion) => {
      if(!criterion.pass && !criterion.criterion_id.exceptions.includes(newAuditResults.installation_id._id)){
        const existStandard = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
        const existStandardForElectric = arrayStandardsFalseForElectric.includes(criterion.criterion_id.standard._id.toString())
        if(!existStandard){
          arrayStandardsFalse = [...arrayStandardsFalse, criterion.criterion_id.standard._id.toString()]
        }
        if(!existStandardForElectric){
          if(criterion.criterion_id.isElectricAudit){
            arrayStandardsFalseForElectric = [...arrayStandardsFalseForElectric, criterion.criterion_id.standard._id.toString()]
          }
        }
        if(criterion.criterion_id.standard.isCore){
          const existArea = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
          const existAreaForElectric = arrayAreasFalseForElectric.includes(criterion.criterion_id.area._id.toString())
          if(!existArea){
            arrayAreasFalse = [...arrayAreasFalse, criterion.criterion_id.area._id.toString()]
          }
          if(!existAreaForElectric){
            if(criterion.criterion_id.isElectricAudit){
              arrayAreasFalseForElectric = [...arrayAreasFalseForElectric, criterion.criterion_id.area._id.toString()]
            }
          }
        }
      }
    })

    if(existAudit?.isCustomAudit){
      arrayStandardsFalse = []
      arrayAreasFalse = []
    }

    const auditResultsForImgAndHme = newAuditResults
    let instalations_audit_details = null
    let instalation_audit_types = null
    const VENTA = '6233b3ace74b428c2dcf3068'
    const POSVENTA = '6233b450e74b428c2dcf3091'
    const HYUNDAI_PROMISE = '6233b445e74b428c2dcf3088'
    const GENERAL = '6233b39fe74b428c2dcf305f'
    let totalWeightPerc = 0
    let totalImgAudit = 0
    let totalPassImgAudit = 0
    let totalHmeAudit = 0
    let totalHmeAuditAux = 0
    let totalPassHmeAudit = 0
    let totalPassHmeAuditAux = 0
    let totalElectricAuditWithoutCore = 0
    let totalPassElectricAuditWithoutCore = 0
    let totalIoniqAudit = 0
    let totalPassIoniqAudit = 0

    //<<<NUEVO
    auditResultsForImgAndHme.criterions.forEach((criterion) => {     
      let isValidType = false
      criterion.criterion_id.installationType.forEach((type) => {
        if(type._id.toString() === newAuditResults.installation_id.installation_type._id.toString()){
          isValidType = true
        }
      })
      // Si es inválido
      if(!(criterion.criterion_id.category.categoryType.toString() === 'VN' && !newAuditResults.installation_id.isSale ||
      criterion.criterion_id.category.categoryType.toString() === 'PV' && !newAuditResults.installation_id.isPostSale ||
      criterion.criterion_id.category.categoryType.toString() === 'HP' && !newAuditResults.installation_id.isHP ||
      criterion.criterion_id.exceptions.includes(newAuditResults.installation_id._id) ||
      !isValidType)){ 
        if(criterion.criterion_id.isImgAudit){
          // Peso total de los criterios imgAudit que aplican
          if(criterion.criterion_id.isHmeAudit){
            totalImgAudit += criterion.criterion_id.value
          } else{
            totalImgAudit += criterion.criterion_id.value
          }
          if(criterion.pass)
            if(criterion.criterion_id.isHmeAudit){
              totalPassImgAudit += criterion.criterion_id.value
            } else{
              totalPassImgAudit += criterion.criterion_id.value
            }
          // Peso total de los criterios imgAudit que aplican
        }
        if(criterion.criterion_id.isIoniqAudit){
          // Peso total de los criterios isIoniqAudit que aplican
          if(criterion.criterion_id.isHmeAudit){
            totalIoniqAudit += criterion.criterion_id.value
          } else{
            totalIoniqAudit += criterion.criterion_id.value
          }
          if(criterion.pass)
            if(criterion.criterion_id.isHmeAudit){
              totalPassIoniqAudit += criterion.criterion_id.value
            } else{
              totalPassIoniqAudit += criterion.criterion_id.value
            }
          // Peso total de los criterios isIoniqAudit que aplican
        }
        if(criterion.criterion_id.isHmeAudit){
          // Peso total de los criterios hmes que aplican
          if(criterion.criterion_id.isHmeAudit){
            totalHmeAudit += criterion.criterion_id.value
            totalHmeAuditAux += 1
          } else{
            totalHmeAudit += criterion.criterion_id.value
          }
          if(criterion.pass)
            if(criterion.criterion_id.isHmeAudit){
              totalPassHmeAudit += criterion.criterion_id.value
              totalPassHmeAuditAux += 1
            } else{
              totalPassHmeAudit += criterion.criterion_id.value
            }
          // Peso total de los criterios hmes que aplican
        }
        if(criterion.criterion_id.isElectricAudit){
          // Peso total de los criterios imgAudit que aplican
          const existSt = arrayStandardsFalseForElectric.includes(criterion.criterion_id.standard._id.toString())
          const existAr = arrayAreasFalseForElectric.includes(criterion.criterion_id.area._id.toString())
          if(criterion.criterion_id.isHmeAudit){
            totalElectricAuditWithoutCore += criterion.criterion_id.value
          } else{
            totalElectricAuditWithoutCore += criterion.criterion_id.value
          }
          if (criterion.pass && !existSt && !existAr) {
            if(criterion.criterion_id.isHmeAudit){
              totalPassElectricAuditWithoutCore += criterion.criterion_id.value
            } else{
              totalPassElectricAuditWithoutCore += criterion.criterion_id.value
            }
          }
          // Peso total de los criterios imgAudit que aplican
        }
      }
    })
    //>>>

    //Convierto en false los criterios afectados por core
    if(!existAudit?.isCustomAudit){
      newAuditResults.criterions.forEach((criterion, index) => {
        const existSt = arrayStandardsFalse.includes(criterion.criterion_id.standard._id.toString())
        const existAr = arrayAreasFalse.includes(criterion.criterion_id.area._id.toString())
        if(existAr || existSt){
          //Pongo en false los criterios afectados por el core
          newAuditResults.criterions[index].pass = false
        }
      })
    }

    //Ordeno el arreglo por standard id
    newAuditResults.criterions.sort(function (a, b) {
      if (a.criterion_id.standard._id.toString() > b.criterion_id.standard._id.toString()) {
        return 1
      }
      if (a.criterion_id.standard._id.toString() < b.criterion_id.standard._id.toString()) {
        return -1
      }
      return 0
    })

    let installationAuditData = {}
    installationAuditData['installation'] =  newAuditResults.installation_id
    let actualCategoryID = ''
    let actualCategoryName = ''
    let accum = 0
    let totalAccum = 0
    let totalCriterionsByCat = 0
    let categories = []
    let totalCriterionsForInst = 0
    let categoriesAux = null
    let totalElectricAudit = 0
    let totalPassElectricAudit = 0
    let totalCritValid = 0
    let totalCriterionWeight = 0

    const sales_weight_per_installation= (newAuditResults.installation_id.sales_weight_per_installation !== null)? newAuditResults.installation_id.sales_weight_per_installation : 0
    const post_sale_weight_per_installation= (newAuditResults.installation_id.post_sale_weight_per_installation !== null)? newAuditResults.installation_id.post_sale_weight_per_installation : 0

    newAuditResults.criterions.sort((criterion_a, criterion_b) => (criterion_a.criterion_id.category.name).localeCompare(criterion_b.criterion_id.category.name))

    // Es la sumatoria de los pesos de cada instalación
    totalWeightPerc +=  sales_weight_per_installation + post_sale_weight_per_installation

    // Criterios electricos, hme, img
    newAuditResults.criterions.forEach((criterion) => {     
      let isValidType = false
      criterion.criterion_id.installationType.forEach((type) => {
        if(type._id.toString() === newAuditResults.installation_id.installation_type._id.toString()){
          isValidType = true
        }
      })
      // Si es inválido
      if(!(criterion.criterion_id.category.categoryType.toString() === 'VN' && !newAuditResults.installation_id.isSale ||
      criterion.criterion_id.category.categoryType.toString() === 'PV' && !newAuditResults.installation_id.isPostSale ||
      criterion.criterion_id.category.categoryType.toString() === 'HP' && !newAuditResults.installation_id.isHP ||
      criterion.criterion_id.exceptions.includes(newAuditResults.installation_id._id) ||
      !isValidType)){ 
        // Peso total de los criterios que aplican
        if(criterion.criterion_id.isHmeAudit){
          totalCriterionWeight += criterion.criterion_id.value
        } else{
          totalCriterionWeight += criterion.criterion_id.value
        }
        // Cantidad de criterios que aplican para esa instalación
        totalCriterionsForInst += 1
        if(criterion.criterion_id.isElectricAudit){
          // Peso total de los criterios Electric que aplican
          totalElectricAudit+= criterion.criterion_id.value
          if(criterion.pass)
            totalPassElectricAudit+= criterion.criterion_id.value
          // Peso total de los criterios hmes que aplican
        }
      }
    })
    // Los demás criterios
    newAuditResults.criterions.forEach((criterion) => {
      let isValidType = false
      criterion.criterion_id.installationType.forEach((type) => {
        if(type._id.toString() === newAuditResults.installation_id.installation_type._id.toString()){
          isValidType = true
        }
      })
      // El criterio no aplica
      if(!(criterion.criterion_id.category.categoryType.toString() === 'VN' && !newAuditResults.installation_id.isSale ||
      criterion.criterion_id.category.categoryType.toString() === 'PV' && !newAuditResults.installation_id.isPostSale ||
      criterion.criterion_id.category.categoryType.toString() === 'HP' && !newAuditResults.installation_id.isHP || 
      criterion.criterion_id.exceptions.includes(newAuditResults.installation_id._id) ||
      !isValidType)){
        // Si actualCategoryID es igual a '', entonces le asigno el categoryID actual
        if(actualCategoryID.length === 0){
          actualCategoryID = criterion.criterion_id.category._id.toString()
          actualCategoryName = criterion.criterion_id.category.name.toString()
        }

        // Defino el multiplicador
        let multiplicator = 1
        if(actualCategoryID === VENTA){
          if(newAuditResults.installation_id.sales_weight_per_installation !== null){
            multiplicator = newAuditResults.installation_id.sales_weight_per_installation/100
          }
          else{
            multiplicator = 1
          }
        }
        else if(actualCategoryID === POSVENTA){
          if(newAuditResults.installation_id.post_sale_weight_per_installation !== null){
            multiplicator = newAuditResults.installation_id.post_sale_weight_per_installation/100
          }
          else{
            multiplicator = 1
          }
        }
        else{
          multiplicator = 1
        }

        totalCritValid += 1

        //Si la categoría actual es igual que la anterior
        if((criterion.criterion_id.category._id.toString() === actualCategoryID)){
          //Cantidad de criterios para esta categoría
          totalCriterionsByCat += 1
          if(criterion.pass){
            //Cantidad de peso acumulado de los cumplidos
            if(criterion.criterion_id.isHmeAudit){
              accum += criterion.criterion_id.value
            } else{
              accum += criterion.criterion_id.value
            }
          }
          //Cantidad acumulada de peso total para esa categoría
          if(criterion.criterion_id.isHmeAudit){
            totalAccum += criterion.criterion_id.value
          } else{
            totalAccum += criterion.criterion_id.value
          }
          // Si la cantidad recorrida de criterios en esta instalación, es igual al total de criterios que tiene esa instalación
          // Entonces guarda la categoría en el arreglo de categorias de esa instalación.
          if(totalCritValid === totalCriterionsForInst){
            const perc = ((accum * 100)/totalAccum) * multiplicator
            const category = {
              id: actualCategoryID.toString(),
              name: actualCategoryName,
              pass: accum,
              total: totalAccum,
              percentageByInstallation: (accum * 100)/totalAccum,
              totalCriterionsByCat: totalCriterionsByCat,
              percentage: perc,
              partialPercentage: (accum * 100) / totalCriterionWeight
            }

            categories = [...categories, category]

            let newTotal = 0

            if(categories.length>0){
              categories.forEach((category) => {
                newTotal += category.partialPercentage
                const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                category['totalCriterionsPercByCat'] = percByCrit * category.percentage / 100
              })
            }
            else if(totalCriterionsForInst>0){
              const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
              categoriesAux['totalCriterionsPercByCat'] = percByCrit * categoriesAux.percentage / 100
              categories = [...categories, categoriesAux]
            }
                        
            const auditTotalResult = newTotal
            categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

            installationAuditData['categories'] = categories

            instalation_audit_types = {
              percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
              percIoniqAudit: totalIoniqAudit === 0? null : (totalPassIoniqAudit * 100)/totalIoniqAudit,
              percElectricAuditWithoutCore: totalImgAudit === 0? null : (totalPassElectricAuditWithoutCore * 100)/totalElectricAuditWithoutCore,
              percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
              percHmeAuditAux: totalHmeAuditAux === 0? null: (totalPassHmeAuditAux * 100)/totalHmeAuditAux,
              percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
            }

            installationAuditData['instalation_audit_types'] =  instalation_audit_types
            installationAuditData['installation'] =  existInstallation
            installationAuditData['totalWeightPerc'] = totalWeightPerc

            instalations_audit_details = installationAuditData
          }
        }
        //Si la categoría actual es diferente que la anterior
        else{
          // Si no es el primer elemento del arreglo de criterios que aplican, o si tiene solo uno, lo guarda en el arreglo de categorias
          if(totalCritValid !== 1 || totalCriterionsForInst === 1){
            const perc = ((accum * 100)/totalAccum) * multiplicator
            const category = {
              id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
              name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
              pass: accum,
              total: totalAccum,
              percentageByInstallation: (accum * 100)/totalAccum,
              totalCriterionsByCat: totalCriterionsByCat,
              percentage: perc,
              partialPercentage: (accum * 100) / totalCriterionWeight
            }
            categories = [...categories, category]
          }

          totalCriterionsByCat = 1
          if(criterion.criterion_id.isHmeAudit){
            totalAccum = criterion.criterion_id.value
          } else{
            totalAccum = criterion.criterion_id.value
          }
          if(criterion.pass){
            accum = criterion.criterion_id.value
            if(criterion.criterion_id.isHmeAudit){
              accum = criterion.criterion_id.value
            } else{
              accum = criterion.criterion_id.value
            }
          }
          else{
            accum = 0
          }
          actualCategoryID = criterion.criterion_id.category._id.toString()
          actualCategoryName = criterion.criterion_id.category.name
          // Si estoy recorriendo el último elemento, entonces lo almaceno
          if(totalCritValid === totalCriterionsForInst && totalCriterionsForInst !== 1){
            const perc = ((accum * 100)/totalAccum) * multiplicator
            const category = {
              id: actualCategoryID.length>0? actualCategoryID: criterion.criterion_id.category._id.toString(),
              name: actualCategoryName.length>0? actualCategoryName: criterion.criterion_id.category.name,
              pass: accum,
              total: totalAccum,
              percentageByInstallation: (accum * 100)/totalAccum,
              totalCriterionsByCat: totalCriterionsByCat,
              percentage: perc,
              partialPercentage: (accum * 100) / totalCriterionWeight
            }
            categories = [...categories, category]

            let newTotal = 0
            if(categories.length>0){
              categories.forEach((category) => {
                newTotal += category.partialPercentage
                const percByCrit = category.totalCriterionsByCat * 100 / totalCriterionsForInst
                category['totalCriterionsPercByCat'] = percByCrit * category.percentage / 100
              })
            }
            else if(totalCriterionsForInst>0){
              const percByCrit = categoriesAux.totalCriterionsByCat * 100 / totalCriterionsForInst
              categoriesAux['totalCriterionsPercByCat'] = percByCrit * categoriesAux.percentage / 100
              categories = [...categories, categoriesAux]
            }

            const auditTotalResult = newTotal 
            categories = [...categories, {auditTotalResult: auditTotalResult? auditTotalResult: 0}]

            installationAuditData['categories'] = categories

            instalation_audit_types = {
              percImgAudit: totalImgAudit === 0? null : (totalPassImgAudit * 100)/totalImgAudit,
              percIoniqAudit: totalIoniqAudit === 0? null : (totalPassIoniqAudit * 100)/totalIoniqAudit,
              percElectricAuditWithoutCore: totalImgAudit === 0? null : (totalPassElectricAuditWithoutCore * 100)/totalElectricAuditWithoutCore,
              percHmeAudit: totalHmeAudit === 0? null :  (totalPassHmeAudit * 100)/totalHmeAudit,
              percHmeAuditAux: totalHmeAuditAux === 0? null: (totalPassHmeAuditAux * 100)/totalHmeAuditAux,
              percElectricAudit: totalElectricAudit === 0? null :  (totalPassElectricAudit * 100)/totalElectricAudit,
            }

            installationAuditData['instalation_audit_types'] =  instalation_audit_types
            installationAuditData['installation'] =  existInstallation
            installationAuditData['totalWeightPerc'] = totalWeightPerc
                        
            if(instalations_audit_details === null){
              instalations_audit_details = []
            }

            instalations_audit_details = [...instalations_audit_details, installationAuditData]
          }
        }
      }      
    })

    auditsResults.forEach((auditres) => {
      auditres.instalations_audit_details.forEach((element) => {
        totalWeightPerc += element.totalWeightPerc
        array_instalations_audit_details = [...array_instalations_audit_details, element]
      })
    })

    array_instalations_audit_details = [...array_instalations_audit_details, instalations_audit_details]

    let accumAgency = 0

    let hp_perc = 0
    let general_perc = 0
    let v_perc = 0
    let pv_perc = 0
    let electric_total = 0
    let electric_perc = 0
    let electric_perc_without_core = 0
    let electric_perc_without_core_total = 0
    let img_total = 0
    let img_perc = 0
    let hme_total = 0
    let hme_perc_aux = 0
    let ioniq_total = 0
    let ioniq_perc = 0
    let agency_by_types_customs = []
    let agency_by_types_customs_total = []
        
    let maxCategories = 0
    let cantInst = 0
    array_instalations_audit_details.forEach((installation) => {
      cantInst += 1
      if(installation?.categories.length - 1 > maxCategories){
        maxCategories = (installation.categories.length - 1)
      }
    })
        
    array_instalations_audit_details.forEach((installation) => {
      if(Array.isArray(installation)){
        installation = installation[0]
      }

      if(installation && installation.categories){
        const sales_weight_per_installation= (installation.installation.sales_weight_per_installation !== null)? installation.installation.sales_weight_per_installation : 0
        const post_sale_weight_per_installation= (installation.installation.post_sale_weight_per_installation !== null)? installation.installation.post_sale_weight_per_installation : 0
        let accumTotalWeightPerc = sales_weight_per_installation + post_sale_weight_per_installation
        const coefficient = ((accumTotalWeightPerc * 100) / totalWeightPerc)/100

        accumAgency += installation.categories[installation.categories.length - 1].auditTotalResult
        installation.categories.forEach((category) => {
          if(category.id === HYUNDAI_PROMISE){
            hp_perc += category.partialPercentage * coefficient
          }
          else if(category.id === GENERAL){
            general_perc += category.partialPercentage * coefficient
          }
          else if(category.id === VENTA){
            v_perc += category.partialPercentage * coefficient
          }
          else if(category.id === POSVENTA){
            pv_perc += category.partialPercentage * coefficient
          }
          else{
            const nameCategory = category.name
            const promedioCategory = category.partialPercentage
            const indexFinded = agency_by_types_customs.findIndex((el) => el.nameCategory === nameCategory)
            if(indexFinded >= 0){
              agency_by_types_customs_total[indexFinded].total = agency_by_types_customs_total[indexFinded].total + 1
              agency_by_types_customs[indexFinded].promedioCategory = agency_by_types_customs[indexFinded].promedioCategory + promedioCategory
            }
            else{
              agency_by_types_customs_total = [...agency_by_types_customs_total, {nameCategory: nameCategory, total: 1}]
              agency_by_types_customs = [...agency_by_types_customs, {nameCategory: nameCategory, promedioCategory: promedioCategory}]
            }
          }
        })

      }

      if(installation && installation.instalation_audit_types){
        if(installation.instalation_audit_types.percImgAudit !== null){
          img_perc+= installation.instalation_audit_types.percImgAudit
          img_total+= 1
        }
        if(installation.instalation_audit_types.percIoniqAudit !== null && installation.instalation_audit_types.percIoniqAudit !== undefined){
          ioniq_perc+= installation.instalation_audit_types.percIoniqAudit
          ioniq_total+= 1
        }
        if(installation.instalation_audit_types.percElectricAudit !== null){
          electric_perc+= installation.instalation_audit_types.percElectricAudit
          electric_total+= 1
        }
        if(installation.instalation_audit_types.percElectricAuditWithoutCore !== null && installation.instalation_audit_types.percElectricAuditWithoutCore !== undefined){
          electric_perc_without_core+= installation.instalation_audit_types.percElectricAuditWithoutCore
          electric_perc_without_core_total+= 1
        }
        if(installation.instalation_audit_types.percHmeAudit !== null){
          hme_perc_aux+= installation.instalation_audit_types.percHmeAuditAux
          hme_total+= 1
        }
      }
    })

    let agency_by_types = {
      electric_perc: (electric_total === 0)? null: electric_perc / electric_total,
      electric_perc_without_core: (electric_perc_without_core_total === 0)? null: electric_perc_without_core / electric_perc_without_core_total,
      img_perc: (img_total === 0)? null: img_perc / img_total,
      ioniq_perc: (ioniq_total === 0)? null: ioniq_perc / ioniq_total,
      hme_perc: (hme_total === 0)? null : hme_perc_aux / hme_total,
      hp_perc: (hp_perc === 0)? null: hp_perc,
      v_perc: (v_perc === 0)? null: v_perc,
      general_perc: (general_perc === 0)? null: general_perc,
      pv_perc: (pv_perc === 0)? null: pv_perc
    }

    if(existAudit?.isCustomAudit){
      agency_by_types_customs.forEach((element, index) => {
        agency_by_types_customs[index].promedioCategory = agency_by_types_customs[index].promedioCategory / cantInst 
      })
    }
        
    let indexDelEl = -1

    agency_by_types_customs.forEach((el, index) => {
      if(el.nameCategory === undefined || el.nameCategory === null || el.promedioCategory === NaN){
        indexDelEl = index
      }
    })

    if(indexDelEl > -1){
      agency_by_types_customs.splice(indexDelEl, 1)
    } else{
      agency_by_types_customs.pop()
    }
        
    agency_by_types['agency_by_types_customs'] = agency_by_types_customs

    let total_agency = 0

    if(!existAudit?.isCustomAudit){
      total_agency = (agency_by_types.hp_perc !== null? agency_by_types.hp_perc: 0) + (agency_by_types.v_perc !== null? agency_by_types.v_perc: 0) + (agency_by_types.general_perc !== null? agency_by_types.general_perc: 0) + (agency_by_types.pv_perc !== null? agency_by_types.pv_perc: 0) 
    } else {
      agency_by_types_customs.forEach((element) => {
        total_agency += element.promedioCategory
      })
    }

    agency_by_types['total_agency'] = total_agency

    const agency_audit_details = accumAgency / array_instalations_audit_details.length

    const updatedFields = {}

    if(audit_id)
      updatedFields['audit_id'] = audit_id
    if(installation_id)
      updatedFields['installation_id'] = installation_id
    if(criterions){
      const auditResultsForUpd = await AuditResults.findById(id)
      const critIndex = auditResultsForUpd.criterions.findIndex(crit => crit.criterion_id.toString() == criterions[0].criterion_id)
      if(critIndex > -1){
        auditResultsForUpd.criterions[critIndex] = criterions[0]
        updatedFields['criterions'] = auditResultsForUpd.criterions
      }
    }
    if(state)
      updatedFields['state'] = state
    if(dateForAudit){
      updatedFields['dateForAudit'] = dateForAudit
    }

    updatedFields['updatedAt'] = Date.now()
    updatedFields['instalations_audit_details'] = instalations_audit_details

    const updatedAuditResults = await AuditResults.findByIdAndUpdate(id, updatedFields, {new: true}).populate({
      path: 'criterions.discussion.user', select: '_id names surnames emailAddress role'})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    const newConsetionResult = {
      audit_id: audit_id,
      dealership_id: dealershipByID._id,
      code: dealershipByID.code,
      name: dealershipByID.name,
      ionic5_quaterly_billing: dealershipByID.ionic5_quaterly_billing,
      vn_quaterly_billing: dealershipByID.vn_quaterly_billing,
      electric_quaterly_billing: dealershipByID.electric_quaterly_billing,
      audit_name: existAudit.name,
      audit_initial_date: existAudit.initial_date,
      audit_end_date: existAudit.end_date,
      dealership_details: dealershipByID,
      audit_criterions_details: [...auditsResultsWithout, updatedAuditResults],
      instalations_audit_details: array_instalations_audit_details,
      agency_audit_details: agency_audit_details,
      agency_by_types: agency_by_types
    }

    await AuditAgency.findOneAndUpdate({audit_id: audit_id, dealership_id: dealershipByID._id}, newConsetionResult, {new: true})
      .catch(error => {        
        return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message}]})
      })

    return
  } catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getDataForFullAuditTest = async(request, response) => {
  const {audit_id} = request.params
    
  try{
    let existAudit = null

    if(!ObjectId.isValid(audit_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid audit_id', 
          detail: `${audit_id} is not an ObjectId`}]})
    }
    else{
      existAudit = await Audit.findById(audit_id)
      if(!existAudit)
        return response.status(400).json(
          {errors: [{code: 400, 
            msg: 'invalid audit_id', 
            detail: `${audit_id} not found`}]}) 
    }

    let auditAgencies = await AuditAgency.find({audit_id: audit_id}).select('code name dealership_id ionic5_quaterly_billing vn_quaterly_billing dealership_details agency_by_types _id id')

    let compliance_audit = 0

    let dealership_details = []

    for(let i = 0; i < auditAgencies.length; i++) {
      const element = auditAgencies[i]
      const AuditInstallationFind = await AuditInstallation.find({audit_id: audit_id, dealership_id: element.dealership_id, audit_status: {$nin: SHOW_RESULTS_STATES}})
    
      let data = {
        code: element.code,
        name: element.name,
        dealership_id: element.dealership_id,
        ionic5_quaterly_billing: element.ionic5_quaterly_billing,
        vn_quaterly_billing: element.vn_quaterly_billing,
        electric_quaterly_billing: element.dealership_details.electric_quaterly_billing, // NEMO, esto lo emparche asi, despues miralo
        percentage_total: element.agency_by_types.total_agency,
        percentage_general: element.agency_by_types.general_perc,
        percentage_venta: element.agency_by_types.v_perc,
        percentage_postventa: element.agency_by_types.pv_perc,
        percentage_HP: element.agency_by_types.hp_perc,
        percentage_audit_electric: element.agency_by_types.electric_perc,
        percentage_audit_img: element.agency_by_types.img_perc,
        percentage_audit_ioniq: element.agency_by_types.ioniq_perc,
        percentage_audit_hme: element.agency_by_types.hme_perc,
        agency_by_types_customs: element?.agency_by_types?.agency_by_types_customs,
        percentage_audit_electric_without_core: element?.agency_by_types?.electric_perc_without_core,
        showAuditResults: AuditInstallationFind.length > 0? false : true
      }
      dealership_details = [...dealership_details, data]

      compliance_audit += element.agency_by_types.total_agency !== null? element.agency_by_types.total_agency : 0
    }

    const audit_data = {
      name: existAudit.name,
      initial_date: existAudit.initial_date,
      end_date: existAudit.end_date,
      compliance_audit: compliance_audit/auditAgencies.length,
      dealership_details: dealership_details
    }

    return response.status(200).json({data: audit_data})
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const tablesTest = async(request, response) => {
  const {dealership_id, audit_id} = request.body
  try{
    if(!ObjectId.isValid(dealership_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid dealership_id', 
          detail: `${dealership_id} is not an ObjectId`}]})
    }
    const dealershipByID = await Dealership.findById(dealership_id)

    if(!dealershipByID)
      return response.status(400).json({code: 404, 
        msg: 'invalid dealership_id',
        detail: 'dealership_id not found'
      })
    let existAudit = null
    if(!ObjectId.isValid(audit_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid audit_id', 
          detail: `${audit_id} is not an ObjectId`}]})
    }
    else{
      existAudit = await Audit.findById(audit_id)
      if(!existAudit)
        return response.status(400).json(
          {errors: [{code: 400, 
            msg: 'invalid audit_id', 
            detail: `${audit_id} not found`}]}) 
    }

    let tables = await AuditAgency.findOne({audit_id: audit_id, dealership_id: dealership_id})
      .populate({path: 'audit_criterions_details.criterions.criterion_id', 
        populate: {path: 'standard installationType block area category auditResponsable criterionType'}})
    if(tables){
      let fixed_instalations_audit_details = []
        
      tables.instalations_audit_details.forEach((i_audit_detail) => {
        if(Array.isArray(i_audit_detail)){
          fixed_instalations_audit_details.push(i_audit_detail[0])
        } else {
          fixed_instalations_audit_details.push(i_audit_detail)
        }
      })
    
      tables.instalations_audit_details = fixed_instalations_audit_details
    
      return response.status(200).json({data: tables})
    }
    else {
      getDataForTables(request, response)
    }
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getDataForAudit = async(request, response) => {
  let {audit_id} = request.params
  let { dealership_id } = request.body
  let isClosed = null
  const AOH = '6226310514861f56d3c64266'

  try{
    let existAudit = null

    const dealershipsInactives = (await Dealership.find({active: false}).select('_id')).map((dealership) => { return dealership._id?.toString() })
    const installationsInactives = (await Installation.find({active: false}).select('_id')).map((installation) => { return installation._id?.toString() })

    if(audit_id === 'last'){
      let audit = null

      if(dealership_id && ObjectId.isValid(dealership_id)){
        const auditsInstallations = await AuditInstallation.find({dealership_id: dealership_id})
        let audit_ids = []
        if(auditsInstallations){
          let auditsForDealership = []
          auditsInstallations.forEach((auditInst) => {
            const existAudit = auditsForDealership.findIndex(el => {
              return el?.audit_id?.toString() === auditInst?.audit_id?.toString()
            })
            if(existAudit > -1){
              auditsForDealership[existAudit].audit_status.push(auditInst.audit_status)
            } else{
              const element = {
                audit_id: auditInst.audit_id,
                audit_status: [auditInst.audit_status]
              }

              auditsForDealership = [...auditsForDealership, element]
            }
          })

          auditsForDealership.forEach((audit) => {
            if(!audit.audit_status.find(el => el !== 'closed')){
              audit_ids = [...audit_ids, audit.audit_id]
            }
          })

          const auditsFiltereds = await Audit.find({_id: {$in: audit_ids}, closed: true})
                    
          auditsFiltereds.sort((a, b) => {
            return b.createdAt - a.createdAt
          })

          if(auditsFiltereds.length > 0){
            audit_id = auditsFiltereds[0]?._id
            audit = auditsFiltereds[0]
          }
        }
                
      } else{
        audit = await Audit.findOne({ closed: true }).sort({$natural:-1}).limit(1)
      }

      if(audit){
        audit_id = audit._id
      } else{
        return response.status(404).json({errors: [{code: 404, msg: 'not found', detail: 'No audits in ddbb'}]})
      }

      /*if(dealership_id){
        const isAuditClosed = await AuditInstallation.find({audit_id: audit._id, audit_status: {$ne: 'closed'}})

        if(isAuditClosed?.length > 0){
          isClosed = false
        } else {
          isClosed = true
        }
      }*/

      isClosed = true
    }

    if(!ObjectId.isValid(audit_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid audit_id', 
          detail: `${audit_id} is not an ObjectId`}]})
    }
    if(dealership_id !== null && dealership_id !== undefined && !ObjectId.isValid(dealership_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid dealership_id', 
          detail: `${dealership_id} is not an ObjectId`}]})
    }
    else{
      existAudit = await Audit.exists({_id: audit_id})
      if(!existAudit)
        return response.status(400).json(
          {errors: [{code: 400, 
            msg: 'invalid audit_id', 
            detail: `${audit_id} not found`}]}) 
    }

    let filter = {audit_id: audit_id}
    if(dealership_id !== null && dealership_id !== undefined && dealership_id !== false){
      filter['dealership_id'] = dealership_id
    }

    if(dealership_id){
      if(!ObjectId.isValid(dealership_id)){
        return response.status(400).json(
          {errors: [{code: 400, 
            msg: 'invalid dealership_id', 
            detail: `${dealership_id} is not an ObjectId`}]})
      }
      const dealershipByID = await Dealership.exists({_id: dealership_id})

      if(!dealershipByID)
        return response.status(400).json({code: 404, 
          msg: 'invalid dealership_id',
          detail: 'dealership_id not found'
        })
      let existAudit = null
      if(!ObjectId.isValid(audit_id)){
        return response.status(400).json(
          {errors: [{code: 400, 
            msg: 'invalid audit_id', 
            detail: `${audit_id} is not an ObjectId`}]})
      }
      else{
        existAudit = await Audit.exists({_id: audit_id})
        if(!existAudit)
          return response.status(400).json(
            {errors: [{code: 400, 
              msg: 'invalid audit_id', 
              detail: `${audit_id} not found`}]}) 
      }
    
      let auditAgencies = await AuditAgency.find(filter).select('_id dealership_details._id instalations_audit_details')

      let hmes_dealership = 0
      let cant_hmes_dealership = 0
      let img_dealership = 0
      let cant_img_dealership = 0
      let electric_dealership = 0
      let cant_electric_dealership = 0
      let hmes_inst = 0
      let cant_hmes_inst = 0
      let img_inst = 0
      let cant_img_inst = 0
      let electric_inst = 0
      let cant_electric_inst = 0
      let total_dealership = 0
      let cant_total_dealership = 0
      let total_inst = 0
      let cant_total_inst = 0
      let installation_details = []

      auditAgencies.forEach((agency) => {
        const findedDeal = dealershipsInactives.includes(agency.dealership_details?._id?.toString())
        if(!findedDeal){
          agency.instalations_audit_details.forEach((installation) => {   
            const findedInst = installationsInactives.includes(installation.installation?._id?.toString())
            if(!findedInst){
              installation_details = [...installation_details, {
                installation_name: installation.installation.name,                        
                installation_id: installation.installation._id.toString(),
                perc: installation.categories[installation.categories.length - 1].auditTotalResult
              }]
              if(installation.installation.installation_type.toString() === AOH){
                if(installation.instalation_audit_types?.percImgAudit !== null && installation.instalation_audit_types?.percImgAudit !== undefined){
                  cant_img_dealership += 1
                  img_dealership += installation.instalation_audit_types.percImgAudit
                }
                if(installation.instalation_audit_types?.percHmeAudit !== null && installation.instalation_audit_types?.percHmeAudit !== undefined){
                  cant_hmes_dealership += 1
                  hmes_dealership += installation.instalation_audit_types.percHmeAudit
                }
                if(installation.instalation_audit_types?.percElectricAudit !== null && installation.instalation_audit_types?.percElectricAudit !== undefined){
                  cant_electric_dealership += 1
                  electric_dealership += installation.instalation_audit_types.percElectricAudit
                }
                total_dealership += installation.categories[installation.categories.length - 1].auditTotalResult
                cant_total_dealership += 1
              } else {
                if(installation.instalation_audit_types?.percImgAudit !== null && installation.instalation_audit_types?.percImgAudit !== undefined){
                  cant_img_inst += 1
                  img_inst += installation.instalation_audit_types.percImgAudit
                }
                if(installation.instalation_audit_types?.percHmeAudit !== null && installation.instalation_audit_types?.percHmeAudit !== undefined){
                  cant_hmes_inst += 1
                  hmes_inst += installation.instalation_audit_types.percHmeAudit
                }
                if(installation.instalation_audit_types?.percElectricAudit !== null && installation.instalation_audit_types?.percElectricAudit !== undefined){
                  cant_electric_inst += 1
                  electric_inst += installation.instalation_audit_types.percElectricAudit
                }
                total_inst += installation.categories[installation.categories.length - 1].auditTotalResult
                cant_total_inst += 1
              }
            }
          })
        }
      })

      const auditFinded = await Audit.findById(audit_id)

      const data = {
        name: auditFinded?.name,
        auditId: audit_id,
        hmes_dealership: (cant_hmes_dealership === 0)? null: hmes_dealership/cant_hmes_dealership,
        img_dealership: (cant_img_dealership === 0)? null: img_dealership/cant_img_dealership,
        electric_dealership: (cant_electric_dealership === 0)? null: electric_dealership/cant_electric_dealership,
        hmes_inst: (cant_hmes_inst === 0)? null: hmes_inst/cant_hmes_inst,
        img_inst: (cant_img_inst === 0)? null: img_inst/cant_img_inst,
        electric_inst: (cant_electric_inst === 0)? null: electric_inst/cant_electric_inst,
        total_dealership: (cant_total_dealership === 0)? null: total_dealership/cant_total_dealership ,
        total_inst: (cant_total_inst === 0)? null: total_inst/cant_total_inst,
        total: (total_dealership + total_inst)/(cant_total_dealership+cant_total_inst),
        instalations_detail: installation_details,
        closed: isClosed
      }
    
      return response.status(200).json({data: data})

    } else {
      let auditAgencies = await AuditAgency.find(filter).select('_id dealership_details._id agency_by_types dealership_details.name instalations_audit_details')

      let hmes_dealership = 0
      let cant_hmes_dealership = 0
      let img_dealership = 0
      let cant_img_dealership = 0
      let electric_dealership = 0
      let cant_electric_dealership = 0
      let hmes_inst = 0
      let cant_hmes_inst = 0
      let img_inst = 0
      let cant_img_inst = 0
      let electric_inst = 0
      let cant_electric_inst = 0
      let total_dealership = 0
      let cant_total_dealership = 0
      let total_inst = 0
      let cant_total_inst = 0
      let installation_details = []
      let total_dealership_inst_proms = []

      let dealership_details_total = []
      let percentage_audit_electric_total = []
      let percentage_audit_img_total = []
      let percentage_audit_hme_total = []

      auditAgencies.forEach((agency) => {
        const findedDeal = dealershipsInactives.includes(agency.dealership_details?._id?.toString())
        dealership_details_total = [...dealership_details_total, agency?.agency_by_types?.total_agency] 
        percentage_audit_electric_total = [...percentage_audit_electric_total, agency?.agency_by_types?.electric_perc]  
        percentage_audit_img_total = [...percentage_audit_img_total, agency?.agency_by_types?.img_perc]  
        percentage_audit_hme_total = [...percentage_audit_hme_total, agency?.agency_by_types?.hme_perc]  
        if(!findedDeal){
          let deal_inst_prom = 0
          agency.instalations_audit_details.forEach((inst) => {  
            const findedInst = installationsInactives.includes(inst.installation?._id?.toString())
            if(!findedInst){
              let installation = Array.isArray(inst)? inst[0] : inst
              installation_details = [...installation_details, {
                installation_name: installation.installation.name,                        
                installation_id: installation.installation?._id?.toString(),
                perc: installation.categories[installation.categories.length - 1].auditTotalResult
              }]
              deal_inst_prom += installation.categories[installation.categories.length - 1].auditTotalResult
              if(installation.installation.installation_type.toString() === AOH){
                if(installation.instalation_audit_types?.percImgAudit !== null && installation.instalation_audit_types?.percImgAudit !== undefined){
                  cant_img_dealership += 1
                  img_dealership += installation.instalation_audit_types.percImgAudit
                }
                if(installation.instalation_audit_types?.percHmeAudit !== null && installation.instalation_audit_types?.percHmeAudit !== undefined){
                  cant_hmes_dealership += 1
                  hmes_dealership += installation.instalation_audit_types.percHmeAudit
                }
                if(installation.instalation_audit_types?.percElectricAudit !== null && installation.instalation_audit_types?.percElectricAudit !== undefined){
                  cant_electric_dealership += 1
                  electric_dealership += installation.instalation_audit_types.percElectricAudit
                }
                total_dealership += installation.categories[installation.categories.length - 1].auditTotalResult
                cant_total_dealership += 1
              } else {
                if(installation.instalation_audit_types?.percImgAudit !== null && installation.instalation_audit_types?.percImgAudit !== undefined){
                  cant_img_inst += 1
                  img_inst += installation.instalation_audit_types.percImgAudit
                }
                if(installation.instalation_audit_types?.percHmeAudit !== null && installation.instalation_audit_types?.percHmeAudit !== undefined){
                  cant_hmes_inst += 1
                  hmes_inst += installation.instalation_audit_types.percHmeAudit
                }
                if(installation.instalation_audit_types?.percElectricAudit !== null && installation.instalation_audit_types?.percElectricAudit !== undefined){
                  cant_electric_inst += 1
                  electric_inst += installation.instalation_audit_types.percElectricAudit
                }
                total_inst += installation.categories[installation.categories.length - 1].auditTotalResult
                cant_total_inst += 1
              }
            }
          })

          deal_inst_prom = deal_inst_prom / agency.instalations_audit_details.length
          total_dealership_inst_proms.push(deal_inst_prom)
        }
      })

      const sum_deal_inst_prom = dealership_details_total?.reduce((a, b) => a + b, 0)
      const dealerships_prom = dealership_details_total.length > 0 ? sum_deal_inst_prom / dealership_details_total.length : 0

      const sum_deal_electric_prom = percentage_audit_electric_total?.reduce((a, b) => a + b, 0)
      const dealerships_electric_prom = percentage_audit_electric_total.length > 0 ? sum_deal_electric_prom / percentage_audit_electric_total.length : 0

      const sum_deal_img_prom = percentage_audit_img_total?.reduce((a, b) => a + b, 0)
      const dealerships_img_prom = percentage_audit_img_total.length > 0 ? sum_deal_img_prom / percentage_audit_img_total.length : 0

      const sum_deal_hme_prom = percentage_audit_hme_total?.reduce((a, b) => a + b, 0)
      const dealerships_hme_prom = percentage_audit_hme_total.length > 0 ? sum_deal_hme_prom / percentage_audit_hme_total.length : 0

      const auditFinded = await Audit.findById(audit_id)

      const data = {
        name: auditFinded?.name,
        auditId: audit_id,
        hmes_dealership: (cant_hmes_dealership === 0)? null: hmes_dealership/cant_hmes_dealership,
        img_dealership: (cant_img_dealership === 0)? null: img_dealership/cant_img_dealership,
        electric_dealership: (cant_electric_dealership === 0)? null: electric_dealership/cant_electric_dealership,
        hmes_inst: (cant_hmes_inst === 0)? null: hmes_inst/cant_hmes_inst,
        img_inst: (cant_img_inst === 0)? null: img_inst/cant_img_inst,
        electric_inst: (cant_electric_inst === 0)? null: electric_inst/cant_electric_inst,
        total_dealership: (cant_total_dealership === 0)? null: total_dealership/cant_total_dealership ,
        dealerships_prom,
        dealerships_electric_prom,
        dealerships_img_prom,
        dealerships_hme_prom,
        total_inst: (cant_total_inst === 0)? null: total_inst/cant_total_inst,
        total: (total_dealership + total_inst)/(cant_total_dealership + cant_total_inst),
        instalations_detail: installation_details,
        closed: isClosed
      }
    
      return response.status(200).json({data: data})
    }        
  }
  catch(error){
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

const getDataInstForAudit = async(request, response) => {
  try {  
    const {audit_id} = request.params
    
    if(!ObjectId.isValid(audit_id)){
      return response.status(400).json(
        {errors: [{code: 400, 
          msg: 'invalid audit_id', 
          detail: `${audit_id} is not an ObjectId`}]})
    }

    const installationsAudit = await AuditResults.find({ audit_id: audit_id })
      .select('installation_id instalations_audit_details.categories instalations_audit_details.instalation_audit_types')
      .populate({
        path: 'installation_id',
        select: 'code name installation_type dealership postal_code province address autonomous_community population isSale isPostSale isHP',
        populate: {
          path: 'installation_type dealership',
          select: 'code name'
        }
      })

    return response.status(200).json({data: installationsAudit})
  }
  catch(error) {
    return response.status(500).json({errors: [{code: 500, msg: 'unhanddle error', detail: error.message,}]})
  }
}

module.exports = {
  createAuditResults,
  updateAuditResults,
  deleteAuditResults,
  getDataForTables,
  getAuditResByAuditIDAndInstallationID,
  getAuditResByAuditID,
  getDataForAudit,
  getDataForFullAudit,
  updateTest,
  getDataForFullAuditTest,
  getDataInstForAudit,
  createAuditResultsTest,
  tablesTest}
