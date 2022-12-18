import { Router } from 'express'

import * as cakeController from './cake.controller'

const router = Router()

router.get('/', cakeController.conFetchAllCakes)

router.get('/available', cakeController.conFetchAllAvailableCakes)

router.get('/:id', cakeController.conFetchCakeById)

export { router as cakeRouter }
