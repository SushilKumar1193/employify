const { StatusCodes } =  require('http-status-codes')
const CustomAPIError =  require('./custom-api.js')

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

module.exports= UnauthenticatedError