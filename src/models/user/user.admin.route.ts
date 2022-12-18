import { Router } from 'express'

import {
  conAddStaff,
  conChangePassword,
  conFetchLoggedInUser,
  conFetchUserByCategory,
  conLoginUser, conToggleUserAccess,
  conUpdateUser
} from './user.controller'
import { authenticator, authorizerManager } from '../../middleware'
import { UserCategory } from './user.types'

const router = Router()

router.post('/login', conLoginUser([UserCategory.STAFF, UserCategory.MANAGER]))

router.use(authenticator)

router.get('/customer-list', conFetchUserByCategory(UserCategory.CUSTOMER))

router.get('/profile', conFetchLoggedInUser)

router.put('/change-password', conChangePassword)

router.put('/update', conUpdateUser)

router.use(authorizerManager)

router.put('/access/:id', conToggleUserAccess)

router.get('/staff-list', conFetchUserByCategory(UserCategory.STAFF))

router.post('/add-staff', conAddStaff)

export { router as userAdminRouter }
