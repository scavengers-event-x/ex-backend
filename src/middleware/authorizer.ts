import { UserModel } from '../models/user/userModel'
import { FieldTypeUserJWT, UserCategory } from '../models/user/user.types'
import { commonResponse, responseCode, userResponse } from '../utils/constants'

const authorizerManager = (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT

  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.NOT_FOUND })
      } else if (user.category !== UserCategory.MANAGER) {
        next({ message: commonResponse.error.UNAUTHORIZED_ACCESS, status: responseCode.FORBIDDEN })
      } else {
        next()
      }
    })
    .catch(() => {
      next({})
    })
}

export { authorizerManager }
