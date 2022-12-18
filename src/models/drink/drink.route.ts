import { Router } from 'express'

import * as drinkController from './drink.controller'

const router = Router()

router.get('/', drinkController.conFetchAllDrinks)

router.get('/available', drinkController.conFetchAllAvailableDrinks)

router.get('/:id', drinkController.conFetchDrinkById)

export { router as drinkRouter }
