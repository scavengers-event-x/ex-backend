import { Router } from 'express'

import {
  eventTypeAdminRouter,
  themeAdminRouter,
  venueAdminRouter,
  cakeAdminRouter,
  decorationAdminRouter,
  drinkAdminRouter,
  eventRouter,
  userAdminRouter
} from './models'
import { authenticator } from './middleware'

const router = Router()

// UNSECURE
router.use('/user', userAdminRouter)

router.use(authenticator)
router.use('/cake', cakeAdminRouter)
router.use('/theme', themeAdminRouter)
router.use('/venue', venueAdminRouter)
router.use('/drink', drinkAdminRouter)
router.use('/event', eventRouter)
router.use('/decoration', decorationAdminRouter)
router.use('/event-type', eventTypeAdminRouter)

// SECURE

export { router as allAdminRouter }
