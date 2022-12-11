import { Router } from 'express'

import * as eventController from './event.controller'
import { multerSingleImage } from '../../middleware'

const router = Router()

router.route('/')
  .get(eventController.conFetchAllEvents)
  .post(multerSingleImage(), eventController.conInsertNewEvent)

router.route('/:id')
  .get(eventController.conFetchEventById)
  .put(multerSingleImage(), eventController.conUpdateEvent)
  .delete(eventController.conDeleteEvent)

export { router as eventRouter }
