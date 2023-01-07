import { Router } from 'express'

import {
  conAddStaff,
  conChangePassword, conFetchChatContact,
  conFetchLoggedInUser,
  conFetchUserByCategory,
  conLoginUser,
  conRequestResetPassword,
  conSetDefaultPassword,
  conToggleUserAccess,
  conUpdateUser
} from './user.controller'
import { authenticator, authorizerCategory, multerSingleImage } from '../../middleware'
import { UserCategory } from './user.types'

const router = Router()

router.post('/login', conLoginUser([UserCategory.STAFF, UserCategory.MANAGER]))

router.put('/request-reset-password', conRequestResetPassword)

router.use(authenticator)

router.get('/customer-list', conFetchUserByCategory(UserCategory.CUSTOMER))

router.get('/profile', conFetchLoggedInUser)

router.put('/change-password', conChangePassword)

router.put('/update', multerSingleImage(), conUpdateUser)

router.get('/chat-contact', conFetchChatContact)

router.use(authorizerCategory(UserCategory.MANAGER))

router.put('/access/:id', conToggleUserAccess)

router.put('/set-default-password/:id', conSetDefaultPassword)

router.get('/staff-list', conFetchUserByCategory(UserCategory.STAFF))

router.post('/add-staff', conAddStaff)

export { router as userAdminRouter }
