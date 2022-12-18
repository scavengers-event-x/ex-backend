import { Router } from 'express'

import {
  conAddStaff,
  conChangePassword,
  conFetchLoggedInUser,
  conFetchUserByCategory,
  conLoginUser,
  conUpdateUser
} from './user.controller'
import { authenticator, authorizerManager } from '../../middleware'
import { UserCategory } from './user.types'

const router = Router()

router.post('/login', conLoginUser([UserCategory.STAFF, UserCategory.MANAGER]))

router.use(authenticator)

router.get('/category/:category', conFetchUserByCategory)

router.post('/add-staff', authorizerManager, conAddStaff)

router.get('/profile', conFetchLoggedInUser)

router.put('/change-password', conChangePassword)

router.put('/update', conUpdateUser)

export { router as userAdminRouter }
