const CustomAPIError = require('./custom-api.js')
const UnauthenticatedError = require('./unauthenticated.js')
const NotFoundError = require('./not-found.js')
const BadRequestError = require('./bad-request.js')

module.exports= { CustomAPIError, UnauthenticatedError, NotFoundError, BadRequestError }