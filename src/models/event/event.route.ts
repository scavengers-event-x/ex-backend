import { Router } from 'express'

import * as eventController from './event.controller'
import { multerSingleImage } from '../../middleware'
import { conAssignStaffToEvent } from './event.controller'

const router = Router()

router.route('/')
  .get(eventController.conFetchAllEvents)
  .post(multerSingleImage('customCakeImage'), eventController.conInsertNewEvent)

router.get('/mine', eventController.conFetchAllEventsOfLoggedInUser)

router.route('/:id')
  .get(eventController.conFetchEventById)
  .put(multerSingleImage('customCakeImage'), eventController.conUpdateEvent)
  .delete(eventController.conDeleteEvent)

router.put('/:id/assign', conAssignStaffToEvent)

export { router as eventRouter }
