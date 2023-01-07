import * as bcrypt from 'bcrypt'

import { userProfileMapping } from './userModel'
import { BCRYPT_SALT_ROUNDS, mailer, prepareOtpMail } from '../../config'
import {
  ECloudFolderName,
  generateJWT,
  generateOTPCode,
  getBodyWithFileUrl,
  makeSuccessObject,
  Nullable
} from '../../utils'
import {
  fetchChatContact,
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
  commonResponse,
  fileResponse,
  OTP_EXPIRY_RESET_PASSWORD,
  responseCode,
  userResponse
} from '../../utils/constants'
import { UploadApiResponse } from 'cloudinary'
import { destroyImage, uploadImage } from '../../middleware'

const conFetchChatContact = async (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT
  try {
    const user = await fetchChatContact(userId)
    res.status(responseCode.OK)
      .send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.FETCH_ALL))
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
  if (!req.body || !req.body.password || !req.body.email || req.body.category !== UserCategory.CUSTOMER || !req.body.profile) {
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

const conAddStaff = async (req, res, next) => {
  if (!req.body || !req.body.email || req.body.category !== UserCategory.STAFF || !req.body.profile) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.NOT_ACCEPTABLE })
  }
  const cryptPassword = await bcrypt.hash(req.body.email.split('@')[0].concat('@ex22'), BCRYPT_SALT_ROUNDS)

  insertUser({ ...req.body, password: cryptPassword })
    .then((insertRes) => {
      if (insertRes) {
        fetchUserById(insertRes._id).then(user => {
          res.status(responseCode.CREATED).send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.ADD_STAFF))
        })
      }
    })
    .catch((err) => {
      const duplicate = err?.message?.includes('duplicate')
      next({ message: duplicate ? userResponse.error.ALREADY_REGISTERED : userResponse.error.ADD_STAFF, status: responseCode.BAD_REQUEST })
    })
}

const conLoginUser = (apiUserCat: UserCategory[]) => (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.NOT_ACCEPTABLE })
  }
  fetchUserByKeyValue({ email })
    .then(async (user) => {
      if (!user || !apiUserCat.includes(user.category)) {
        return next({ message: userResponse.error.LOGIN, status: responseCode.UNAUTHORIZED })
      }
      if (!user.access) {
        return next({ message: userResponse.error.NO_ACCESS, status: responseCode.UNAUTHORIZED })
      }
      const passwordVerified = await bcrypt.compare(password, user.password)
      if (!passwordVerified) {
        return next({ message: userResponse.error.LOGIN, status: responseCode.UNAUTHORIZED })
      }
      if (user.accountStatus === UserAccountStatus.DE_ACTIVE) {
        updateUser(user._id, { accountStatus: UserAccountStatus.ACTIVE })
      }
      res.status(responseCode.OK)
        .send(makeSuccessObject<{user: FieldTypeUser, token: string}>({ user, token: generateJWT(user) }, userResponse.success.LOGIN))
    })
    .catch(() => {
      next({ message: userResponse.error.LOGIN, status: responseCode.UNAUTHORIZED })
    })
}

const conUpdateUser = async (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT

  let fileDetail:Nullable<UploadApiResponse> = null
  try {
    const userInSystem = await fetchUserById(userId)
    if (!userInSystem) {
      return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    if (req.file?.path) {
      fileDetail = await uploadImage(req.file?.path, ECloudFolderName.USER)
      if (!fileDetail) {
        return next({ message: fileResponse.error.UPLOAD, status: responseCode.INTERNAL_SERVER })
      }
      if (userInSystem.image.public_id) { await destroyImage(userInSystem.image.public_id) }
    }

    console.log('req: ', req.body)

    const mappedUser = userProfileMapping(req.body)
    const hasProfileData = Object.keys(mappedUser?.profile).length > 0
    if (!hasProfileData && !fileDetail) {
      return next({ message: commonResponse.error.NO_DATA_TO_UPDATE('user'), status: responseCode.BAD_REQUEST })
    }

    updateUser(userId, { ...getBodyWithFileUrl(hasProfileData ? mappedUser : {}, fileDetail) })
      .then((user) => {
        res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeUser>(user, userResponse.success.USER_UPDATED))
      })
      .catch(() => {
        next({ message: userResponse.error.USER_UPDATE, status: responseCode.BAD_REQUEST })
      })
  } catch (_err) {
    next({ message: userResponse.error.USER_UPDATE, status: responseCode.BAD_REQUEST })
  }
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

const conToggleUserAccess = (req, res, next) => {
  const userId = req.params.id

  fetchUserById(userId).then((user) => {
    if (!user) {
      return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    updateUser(userId, { access: !user.access })
      .then((user2) => {
        res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeUser>(user2, !user2.access ? userResponse.success.ACCESS_REVOKED : userResponse.success.ACCESS_GRANTED))
      })
      .catch(() => {
        next({ message: user.access ? userResponse.error.ACCESS_REVOKE : userResponse.error.ACCESS_GRANT, status: responseCode.BAD_REQUEST })
      })
  })
    .catch(() => {
      next({ message: userResponse.error.DEACTIVATION, status: responseCode.BAD_REQUEST })
    })
}

const conSetDefaultPassword = (req, res, next) => {
  const userId = req.params.id

  fetchUserById(userId).then(async (user) => {
    if (!user) {
      return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    if (!user.passwordResetRequestDate) {
      return next({ message: userResponse.error.PASSWORD_DEFAULT, status: responseCode.BAD_REQUEST })
    }
    const cryptPassword = await bcrypt.hash(user.email.split('@')[0].concat('@ex22'), BCRYPT_SALT_ROUNDS)

    updateUser(userId, { password: cryptPassword, passwordResetRequestDate: null, lastPasswordDefaultResetDate: Date.now() })
      .then((user2) => {
        res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeUser>(user2, userResponse.success.PASSWORD_DEFAULT))
      })
      .catch(() => {
        next({ message: userResponse.error.PASSWORD_DEFAULT, status: responseCode.BAD_REQUEST })
      })
  })
    .catch(() => {
      next({ message: userResponse.error.PASSWORD_DEFAULT, status: responseCode.BAD_REQUEST })
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
                res.status(responseCode.OK).send(makeSuccessObject<null>(null, userResponse.success.OTP_SENT(user.email)))
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

const conFetchUserByCategory = (category: UserCategory) => async (req, res, next) => {
  if (category === UserCategory.MANAGER) {
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

const conRequestResetPassword = (req, res, next) => {
  const { email } = req.body
  if (!email) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }

  fetchUserByKeyValue({ email })
    .then((user) => {
      if (!user) {
        return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.NOT_FOUND })
      }
      if (user.category !== UserCategory.STAFF) {
        return next({ message: userResponse.error.ONLY_STAFF_REQ, status: responseCode.BAD_REQUEST })
      }
      if ((user.lastPasswordDefaultResetDate + 86400000) > Date.now()) {
        return next({ message: userResponse.error.RESET_REQUEST_TIME, status: responseCode.BAD_REQUEST })
      }
      if (user.passwordResetRequestDate) {
        return next({ message: userResponse.error.ALREADY_RESET_REQUESTED, status: responseCode.BAD_REQUEST })
      }
      updateUser(user._id, { passwordResetRequestDate: new Date() })
        .then((user) => {
          res.status(responseCode.ACCEPTED).send(makeSuccessObject<null>(null, userResponse.success.RESET_REQUEST))
        })
        .catch(() => {
          next({ message: userResponse.error.RESET_REQUEST, status: responseCode.BAD_REQUEST })
        })
    })
    .catch(() => {
      next()
    })
}

export {
  conToggleUserAccess,
  conFetchChatContact,
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
  conChangePassword,
  conAddStaff,
  conSetDefaultPassword,
  conRequestResetPassword
}
