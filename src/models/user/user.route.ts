import { Router } from 'express'

import {
  conChangePassword,
  conDeactivateUser, conFetchChatContact,
  conFetchLoggedInUser,
  conFetchUserById,
  conLoginUser,
  conRegisterNewUser,
  conResetPassword,
  conSendOTP,
  conUpdateUser,
  conVerifyOTP
} from './user.controller'
import { UserCategory, UserOperations } from './user.types'
import { authenticator, authorizerCategory, multerSingleImage } from '../../middleware'

const router = Router()

router.post('/login', conLoginUser([UserCategory.CUSTOMER]))

router.post('/register', conRegisterNewUser)

router.post('/verify-otp', conVerifyOTP)

router.post('/resend-otp', conSendOTP)

router.post('/forgot-password', (req, res, next) => {
  req.body.operation = UserOperations.FORGOT_PASSWORD
  req.newOperation = true
  next()
}, conSendOTP)

router.post('/reset-password', conResetPassword)

// SECURED
router.use(authenticator, authorizerCategory(UserCategory.CUSTOMER))

// UNSECURE
router.get('/profile', conFetchLoggedInUser)

router.get('/chat-contact', conFetchChatContact)

router.put('/change-password', conChangePassword)

router.put('/update', multerSingleImage(), conUpdateUser)

router.get('/deactivate', conDeactivateUser)

router.get('/:id', conFetchUserById)

export { router as userRouter }
