import { Router } from 'express'

import { userRouter, eventTypeRouter, themeRouter, venueRouter, cakeRouter, decorationRouter, drinkRouter } from './models'

const router = Router()

// UNSECURE
router.use('/user', userRouter)
router.use('/cake', cakeRouter)
router.use('/theme', themeRouter)
router.use('/venue', venueRouter)
router.use('/drink', drinkRouter)
router.use('/decoration', decorationRouter)
router.use('/event-type', eventTypeRouter)

// SECURE

export { router as allRouter }
