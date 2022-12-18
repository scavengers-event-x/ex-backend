import { Router } from 'express'

import {
  eventTypeRouter,
  themeRouter,
  venueRouter,
  cakeRouter,
  decorationRouter,
  drinkRouter,
  eventRouter,
  userAdminRouter
} from './models'
import { authenticator } from './middleware'

const router = Router()

// UNSECURE
router.use('/user', userAdminRouter)

router.use(authenticator)
router.use('/cake', cakeRouter)
router.use('/theme', themeRouter)
router.use('/venue', venueRouter)
router.use('/drink', drinkRouter)
router.use('/event', eventRouter)
router.use('/decoration', decorationRouter)
router.use('/event-type', eventTypeRouter)

// SECURE

export { router as allAdminRouter }
