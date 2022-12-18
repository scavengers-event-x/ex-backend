import { Router } from 'express'

import * as cakeController from './cake.controller'
import { multerSingleImage } from '../../middleware'

const router = Router()

router.route('/')
  .get(cakeController.conFetchAllCakes)
  .post(multerSingleImage(), cakeController.conInsertNewCake)

router.get('/available', cakeController.conFetchAllAvailableCakes)

router.put('/availability/:id', cakeController.conToggleCakeAvailability)

router.route('/:id')
  .get(cakeController.conFetchCakeById)
  .put(multerSingleImage(), cakeController.conUpdateCake)
  .delete(cakeController.conDeleteCake)

export { router as cakeAdminRouter }
