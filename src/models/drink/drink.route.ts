import { Router } from 'express'

import { multerSingleImage } from '../../middleware'
import * as drinkController from './drink.controller'

const router = Router()

router.route('/')
  .get(drinkController.conFetchAllDrinks)
  .post(multerSingleImage(), drinkController.conInsertNewDrink)

router.get('/available', drinkController.conFetchAllAvailableDrinks)

router.put('/availability/:id', drinkController.conToggleDrinkAvailability)

router.route('/:id')
  .get(drinkController.conFetchDrinkById)
  .put(multerSingleImage(), drinkController.conUpdateDrink)
  .delete(drinkController.conDeleteDrink)

export { router as drinkRouter }
