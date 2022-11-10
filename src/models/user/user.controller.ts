import { ObjectId } from 'mongoose'

import { userProfileMapping } from './userModel'
import { generateJWT, makeSuccessObject } from '../../utils'
import { FieldTypeUser, FieldTypeUserJWT, UserCategory } from './user.types'
import { commonResponse, responseCode, userResponse } from '../../utils/constants'
import { fetchAllUsers, fetchUserById, fetchUserByKeyValue, insertUser, updateUser } from './user.query'

const conFetchAllUsers = async (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT

  try {
    const users = await fetchAllUsers(userId)
    res.status(users && users.length > 0 ? responseCode.OK : responseCode.OK)
      .send(makeSuccessObject<FieldTypeUser[]>(users, userResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: userResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchLoggedInUser = async (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT

  try {
    const user = await fetchUserById(userId)
    res.status(user ? responseCode.OK : responseCode.OK)
      .send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.USER_PROFILE))
  } catch (_err) {
    next({ message: userResponse.error.USER_PROFILE, status: responseCode.BAD_REQUEST })
  }
}

const conFetchUserById = async (req, res, next) => {
  const userId = req.params.id

  try {
    const user = await fetchUserById(userId)
    if (!user) {
      return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    res.status(user ? responseCode.OK : responseCode.OK)
      .send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.USER_PROFILE))
  } catch (_err) {
    next({ message: userResponse.error.USER_PROFILE, status: responseCode.BAD_REQUEST })
  }
}

const conGetJWTToken = (req, res, next) => {
  const { email } = req.body
  if (!email) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.NOT_ACCEPTABLE })
  }
  fetchUserByKeyValue({ email })
    .then(async (user) => {
      if (!user) {
        return next({ message: userResponse.error.UNKNOWN_EMAIL, status: responseCode.UNAUTHORIZED })
      }
      res.status(responseCode.OK)
        .send(makeSuccessObject<{_id: ObjectId, token: string}>({ _id: user._id as ObjectId, token: generateJWT(user) }, userResponse.success.JWT_TOKEN))
    })
    .catch(() => {
      next({ message: userResponse.error.GENERATE_JWT, status: responseCode.UNAUTHORIZED })
    })
}

const conInviteUser = (req, res, next) => {
  const { email, fullName } = req.body
  if (!email || !fullName) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.NOT_ACCEPTABLE })
  }
  insertUser({ email, fullName, category: UserCategory.USER })
    .then(async (user) => {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.INVITE_USER))
    })
    .catch(() => {
      next({ message: userResponse.error.INVITE_USER, status: responseCode.BAD_REQUEST })
    })
}

const conUpdateUserInfo = (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT
  const mappedUser = userProfileMapping(req.body)
  if (!mappedUser) {
    return next({ message: commonResponse.error.NO_DATA_TO_UPDATE('user'), status: responseCode.BAD_REQUEST })
  }

  updateUser(userId, mappedUser)
    .then((user) => {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.USER_UPDATED))
    })
    .catch(() => {
      next({ message: userResponse.error.USER_UPDATE, status: responseCode.BAD_REQUEST })
    })
}

export {
  conFetchAllUsers,
  conFetchLoggedInUser,
  conUpdateUserInfo,
  conFetchUserById,
  conGetJWTToken,
  conInviteUser
}
