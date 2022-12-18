import { Router } from 'express'

import * as eventTypeController from './eventType.controller'

const router = Router()

router.get('/', eventTypeController.conFetchAllEventTypes)

router.get('/:id', eventTypeController.conFetchEventTypeById)

export { router as eventTypeRouter }
