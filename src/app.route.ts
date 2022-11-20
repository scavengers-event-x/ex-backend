import { Router } from 'express'

import { userRouter, eventTypeRouter, themeRouter, venueRouter, cakeRouter, decorationRouter } from './models'

const router = Router()

// UNSECURE
router.use('/user', userRouter)
router.use('/cake', cakeRouter)
router.use('/theme', themeRouter)
router.use('/venue', venueRouter)
router.use('/decoration', decorationRouter)
router.use('/event-type', eventTypeRouter)

// SECURE

export { router as allRouter }
