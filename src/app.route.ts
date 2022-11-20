import { Router } from 'express'

import { userRouter, eventTypeRouter } from './models'

const router = Router()

// UNSECURE
router.use('/user', userRouter)
router.use('/event-type', eventTypeRouter)

// SECURE

export { router as allRouter }
