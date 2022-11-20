import { Router } from 'express'

import * as drinkController from './drink.controller'

const router = Router()

router.route('/')
  .get(drinkController.conFetchAllDrinks)
  .post(drinkController.conInsertNewDrink)

router.get('/available', drinkController.conFetchAllAvailableDrinks)

router.put('/availability/:id', drinkController.conToggleDrinkAvailability)

router.route('/:id')
  .get(drinkController.conFetchDrinkById)
  .put(drinkController.conUpdateDrink)
  .delete(drinkController.conDeleteDrink)

export { router as drinkRouter }
