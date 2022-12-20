import { Router } from 'express'

import * as cakeController from './cake.controller'
import { authorizerManager, multerSingleImage } from '../../middleware'

const router = Router()

router.route('/')
  .get(cakeController.conFetchAllCakes)
  .post(authorizerManager, multerSingleImage(), cakeController.conInsertNewCake)

router.get('/available', cakeController.conFetchAllAvailableCakes)

router.put('/availability/:id', authorizerManager, cakeController.conToggleCakeAvailability)

router.route('/:id')
  .get(cakeController.conFetchCakeById)
  .put(authorizerManager, multerSingleImage(), cakeController.conUpdateCake)
  .delete(authorizerManager, cakeController.conDeleteCake)

export { router as cakeAdminRouter }
