const notFound = (request, response) => {
  response.status(404).json({msg: 'not found'})
}

module.exports = notFound