import { Router } from 'express'

import * as cakeController from './cake.controller'

const router = Router()

router.route('/')
  .get(cakeController.conFetchAllCakes)
  .post(cakeController.conInsertNewCake)

router.get('/available', cakeController.conFetchAllAvailableCakes)

router.put('/availability/:id', cakeController.conToggleCakeAvailability)

router.route('/:id')
  .get(cakeController.conFetchCakeById)
  .put(cakeController.conUpdateCake)
  .delete(cakeController.conDeleteCake)

export { router as cakeRouter }
