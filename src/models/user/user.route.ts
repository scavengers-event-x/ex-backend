import { Router } from 'express'

import { authenticator } from '../../middleware/authenticator'
import {
  conFetchAllUsers,
  conFetchLoggedInUser,
  conFetchUserById,
  conUpdateUserInfo,
  conGetJWTToken,
  conInviteUser
} from './user.controller'
import { authorizerAdmin } from '../../middleware/authorizer'

const router = Router()

// UNSECURE
router.post('/get-jwt', conGetJWTToken)

// SECURED
router.use(authenticator)

router.get('/', authorizerAdmin, conFetchAllUsers)

router.post('/invite', conInviteUser)

router.get('/profile', conFetchLoggedInUser)

router.put('/update', conUpdateUserInfo)

router.get('/:id', conFetchUserById)

export { router as userRouter }
