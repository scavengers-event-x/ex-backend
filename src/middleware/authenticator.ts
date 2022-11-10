import { verifyJWT } from '../utils'
import { FieldTypeUserJWT } from '../models/user/user.types'
import { getUserValidStatus } from '../models/user/user.query'
import { responseCode, userResponse } from '../utils/constants'

const authenticator = async (req, res, next) => {
  const token = req.headers?.authorization
  if (!token) {
    return next({ message: userResponse.error.JWT_TOKEN, status: responseCode.UNAUTHORIZED })
  }

  try {
    const user:FieldTypeUserJWT = await verifyJWT(token.toString().trim())
    const userValidStatus = await getUserValidStatus(user.userId)
    if (!userValidStatus.isInSystem) {
      return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.NOT_FOUND })
    }

    req.loggedInUser = user
    next()
  } catch (err) {
    return next({ message: userResponse.error.JWT_TOKEN, status: responseCode.UNAUTHORIZED })
  }
}

export { authenticator }
