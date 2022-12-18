import { Router } from 'express'

import {
  conAddStaff,
  conChangePassword,
  conFetchLoggedInUser,
  conLoginUser,
  conUpdateUser
} from './user.controller'
import { authenticator, authorizerManager } from '../../middleware'

const router = Router()

router.post('/login', conLoginUser)

router.use(authenticator)

router.post('/add-staff', authorizerManager, conAddStaff)

router.get('/profile', conFetchLoggedInUser)

router.put('/change-password', conChangePassword)

router.put('/update', conUpdateUser)

export { router as userAdminRouter }
