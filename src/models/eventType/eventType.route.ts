import { Router } from 'express'

import * as eventTypeController from './eventType.controller'

const router = Router()

router.route('/')
  .get(eventTypeController.conFetchAllEventTypes)
  .post(eventTypeController.conInsertNewEventType)

router.route('/:id')
  .get(eventTypeController.conFetchEventTypeById)
  .put(eventTypeController.conUpdateEventType)
  .delete(eventTypeController.conDeleteEventType)

export { router as eventTypeRouter }
