import { Router } from 'express'

import {
  conChangePassword,
  conDeactivateUser,
  conFetchLoggedInUser,
  conFetchUserByCategory,
  conFetchUserById,
  conLoginUser,
  conRegisterNewUser,
  conResetPassword,
  conSendOTP,
  conUpdateUser,
  conVerifyOTP
} from './user.controller'
import { authenticator } from '../../middleware'
import { UserCategory, UserOperations } from './user.types'

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
router.use(authenticator)

// UNSECURE
router.get('/profile', conFetchLoggedInUser)

router.put('/change-password', conChangePassword)

router.put('/update', conUpdateUser)

router.get('/deactivate', conDeactivateUser)

router.get('/category/:category', conFetchUserByCategory)

router.get('/:id', conFetchUserById)

export { router as userRouter }
