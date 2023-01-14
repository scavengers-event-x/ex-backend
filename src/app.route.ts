import { Router } from 'express'

import {
  userRouter,
  themeRouter,
  venueRouter,
  cakeRouter,
  drinkRouter,
  eventRouter,
  decorationRouter,
  announcementRouter, chatRouter
} from './models'
import { authenticator } from './middleware'

const router = Router()

// UNSECURE
router.use('/user', userRouter)

router.use(authenticator)
router.use('/cake', cakeRouter)
router.use('/chat', chatRouter)
router.use('/theme', themeRouter)
router.use('/venue', venueRouter)
router.use('/drink', drinkRouter)
router.use('/event', eventRouter)
router.use('/decoration', decorationRouter)
router.use('/announcement', announcementRouter)

// SECURE

export { router as allRouter }
