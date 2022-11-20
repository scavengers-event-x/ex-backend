import { Router } from 'express'

import * as decorationController from './decoration.controller'

const router = Router()

router.route('/')
  .get(decorationController.conFetchAllDecorations)
  .post(decorationController.conInsertNewDecoration)

router.get('/available', decorationController.conFetchAllAvailableDecorations)

router.put('/availability/:id', decorationController.conToggleDecorationAvailability)

router.route('/:id')
  .get(decorationController.conFetchDecorationById)
  .put(decorationController.conUpdateDecoration)
  .delete(decorationController.conDeleteDecoration)

export { router as decorationRouter }
