import * as bcrypt from 'bcrypt'
import { ObjectId } from 'mongoose'

import { userProfileMapping } from './userModel'
import { BCRYPT_SALT_ROUNDS, mailer, prepareOtpMail } from '../../config'
import { generateJWT, generateOTPCode, makeSuccessObject } from '../../utils'
import {
  fetchAllUsers,
  fetchUserById,
  fetchUserByKeyValue,
  fetchUserCredential,
  fetchUsersByCategory,
  insertUser,
  updateUser
} from './user.query'
import {
  FieldTypeUser,
  FieldTypeUserJWT,
  FieldTypeUserMain,
  UserAccountStatus,
  UserCategory,
  UserOperations
} from './user.types'
import {
  OTP_EXPIRY_RESET_PASSWORD,
  commonResponse,
  responseCode,
  userResponse
} from '../../utils/constants'

const conFetchAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers()
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

const conRegisterNewUser = async (req, res, next) => {
  if (!req.body || !req.body.password || !req.body.email || !req.body.category || !req.body.profile) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.NOT_ACCEPTABLE })
  }
  const cryptPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
  const { otpExpiry, otpCode } = generateOTPCode()
  const cryptOtp = await bcrypt.hash(otpCode, BCRYPT_SALT_ROUNDS)

  mailer.sendMail(prepareOtpMail({ emailId: req.body.email, fullName: req.body.profile.fullName, operation: UserOperations.REGISTER, otpCode }))
    .then(() => {
      insertUser({ ...req.body, operation: UserOperations.REGISTER, otpCode: cryptOtp, otpExpiry, password: cryptPassword })
        .then((insertRes) => {
          if (insertRes) {
            fetchUserById(insertRes._id).then(user => {
              res.status(responseCode.CREATED).send(makeSuccessObject<FieldTypeUser>(user, `${userResponse.success.REGISTER} ${userResponse.success.OTP_SENT(user.email)}`))
            })
          }
        })
        .catch((err) => {
          const duplicate = err?.message?.includes('duplicate')
          next({ message: duplicate ? userResponse.error.ALREADY_REGISTERED : userResponse.error.REGISTER, status: responseCode.BAD_REQUEST })
        })
    })
    .catch(() => {
      next({ message: userResponse.error.OTP_SENT(req.body.email), status: responseCode.BAD_REQUEST })
    })
}

const conLoginUser = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.NOT_ACCEPTABLE })
  }
  fetchUserByKeyValue({ email })
    .then(async (user) => {
      if (!user) {
        return next({ message: userResponse.error.LOGIN, status: responseCode.UNAUTHORIZED })
      }
      const passwordVerified = await bcrypt.compare(password, user.password)
      if (!passwordVerified) {
        return next({ message: userResponse.error.LOGIN, status: responseCode.UNAUTHORIZED })
      }
      res.status(responseCode.OK)
        .send(makeSuccessObject<{_id: ObjectId, token: string}>({ _id: user._id as ObjectId, token: generateJWT(user) }, userResponse.success.LOGIN))
    })
    .catch(() => {
      next({ message: userResponse.error.LOGIN, status: responseCode.UNAUTHORIZED })
    })
}

const conUpdateUser = (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT

  const mappedUser = userProfileMapping(req.body)
  if (!mappedUser?.profile) {
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

const conDeactivateUser = (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT

  updateUser(userId, { accountStatus: UserAccountStatus.DE_ACTIVE })
    .then((user) => {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.DEACTIVATION))
    })
    .catch(() => {
      next({ message: userResponse.error.DEACTIVATION, status: responseCode.BAD_REQUEST })
    })
}

const conVerifyOTP = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.otpCode || !req.body.operation) {
    res.status(400).send(commonResponse.error.INVALID_BODY)
  } else {
    const { email, otpCode, operation } = req.body
    fetchUserByKeyValue({ email })
      .then(async (user) => {
        if (!user) {
          return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.BAD_REQUEST })
        }
        if (!user.operation || !user.otpCode || user.operation !== operation) {
          return next({ message: userResponse.error.INVALID_OPERATION, status: responseCode.METHOD_NOT_ALLOWED })
        }
        if (Date.now() > new Date(user.otpExpiry).getTime()) {
          return next({ message: userResponse.error.OTP_EXPIRED, status: responseCode.BAD_REQUEST })
        }
        const otpVerified = await bcrypt.compare(otpCode, user.otpCode)
        if (!otpVerified) {
          return next({ message: userResponse.error.OTP_INVALID, status: responseCode.BAD_REQUEST })
        }
        const updateValues = {
          operation: user.operation === UserOperations.FORGOT_PASSWORD ? UserOperations.RESET_PASSWORD : null,
          otpCode: null,
          otpExpiry: user.operation === UserOperations.FORGOT_PASSWORD ? Date.now() + OTP_EXPIRY_RESET_PASSWORD : null
        }
        user.operation === UserOperations.REGISTER && Object.assign(updateValues, { isVerified: true })
        updateUser(user._id, updateValues)
          .then(() => {
            res.status(responseCode.OK).send(makeSuccessObject<null>(null, userResponse.success.OTP_VERIFIED))
          })
          .catch(() => {
            next({ message: userResponse.error.USER_UPDATE, status: responseCode.BAD_REQUEST })
          })
      })
      .catch(() => {
        next()
      })
  }
}

const conSendOTP = async (req, res, next) => {
  if (!req.body || !req.body.operation || !req.body.email) {
    res.status(400).send(commonResponse.error.INVALID_BODY)
  } else {
    const { otpExpiry, otpCode } = generateOTPCode()
    const cryptOtp = await bcrypt.hash(otpCode, BCRYPT_SALT_ROUNDS)
    const { email, operation } = req.body
    fetchUserByKeyValue({ email })
      .then((user) => {
        if (!user) {
          return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.NOT_FOUND })
        }
        if (!req.newOperation && (!user.operation || user.operation !== operation)) {
          return next({ message: userResponse.error.INVALID_OPERATION, status: responseCode.METHOD_NOT_ALLOWED })
        }
        mailer.sendMail(prepareOtpMail({ emailId: email, fullName: user.profile.fullName, operation: user.operation, otpCode }))
          .then(() => {
            updateUser(user._id, { operation, otpCode: cryptOtp, otpExpiry })
              .then(() => {
                res.status(responseCode.OK).send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.OTP_SENT(user.email)))
              })
              .catch(() => {
                next({ message: userResponse.error.OTP_SENT(email), status: responseCode.BAD_REQUEST })
              })
          })
          .catch(() => {
            next({ message: userResponse.error.OTP_SENT(email), status: responseCode.BAD_REQUEST })
          })
      })
      .catch(() => {
        next()
      })
  }
}

const conResetPassword = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send(commonResponse.error.INVALID_BODY)
  } else {
    const { email, password } = req.body
    fetchUserByKeyValue({ email })
      .then(async (user) => {
        if (!user) {
          return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.BAD_REQUEST })
        }
        if (!user.operation || user.operation !== UserOperations.RESET_PASSWORD || Date.now() > new Date(user.otpExpiry).getTime()) {
          return next({ message: userResponse.error.INVALID_OPERATION, status: responseCode.METHOD_NOT_ALLOWED })
        }
        const cryptPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        updateUser(user._id, { operation: null, otpExpiry: null, password: cryptPassword })
          .then(() => {
            res.status(responseCode.OK).send(makeSuccessObject<null>(null, userResponse.success.RESET_PASSWORD))
          })
          .catch(() => {
            next({ message: userResponse.error.RESET_PASSWORD, status: responseCode.BAD_REQUEST })
          })
      })
      .catch(() => {
        next()
      })
  }
}

const conFetchUserByCategory = async (req, res, next) => {
  const category = req.params.category
  if (category !== UserCategory.CUSTOMER) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const users = await fetchUsersByCategory(category)
    res.status(responseCode.OK)
      .send(makeSuccessObject<FieldTypeUser[]>(users, userResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: userResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conChangePassword = (req, res, next) => {
  const { prevPassword, newPassword } = req.body
  if (!prevPassword || !newPassword) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  const { userId } = req.loggedInUser as FieldTypeUserJWT
  fetchUserCredential(userId)
    .then(async (user) => {
      if (!user) {
        return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.BAD_REQUEST })
      }
      const passwordVerified = await bcrypt.compare(prevPassword, user.password)
      if (passwordVerified) {
        const cryptPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)
        updateUser(userId, { password: cryptPassword })
          .then((user) => {
            res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeUserMain>(user, userResponse.success.CHANGE_PASSWORD))
          })
          .catch(() => {
            next({ message: userResponse.error.CHANGE_PASSWORD, status: responseCode.INTERNAL_SERVER })
          })
      } else {
        next({ message: userResponse.error.INVALID_PASSWORD, status: responseCode.UNAUTHORIZED })
      }
    })
    .catch(() => {
      next({})
    })
}

export {
  conFetchAllUsers,
  conFetchUserByCategory,
  conFetchLoggedInUser,
  conRegisterNewUser,
  conLoginUser,
  conUpdateUser,
  conDeactivateUser,
  conVerifyOTP,
  conSendOTP,
  conResetPassword,
  conFetchUserById,
  conChangePassword
}
