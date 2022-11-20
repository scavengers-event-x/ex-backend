import { Router } from 'express'

import { userRouter, eventTypeRouter, themeRouter } from './models'

const router = Router()

// UNSECURE
router.use('/user', userRouter)
router.use('/theme', themeRouter)
router.use('/event-type', eventTypeRouter)

// SECURE

export { router as allRouter }
