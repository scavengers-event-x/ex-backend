import { Router } from 'express'

import {
  themeAdminRouter,
  venueAdminRouter,
  cakeAdminRouter,
  decorationAdminRouter,
  drinkAdminRouter,
  eventRouter,
  userAdminRouter,
  announcementAdminRouter
} from './models'
import { authenticator, authorizerManager } from './middleware'

const router = Router()

// UNSECURE
router.use('/user', userAdminRouter)

router.use(authenticator)
router.use('/event', eventRouter)

router.use(authorizerManager)
router.use('/cake', cakeAdminRouter)
router.use('/theme', themeAdminRouter)
router.use('/venue', venueAdminRouter)
router.use('/drink', drinkAdminRouter)
router.use('/decoration', decorationAdminRouter)
router.use('/announcement', announcementAdminRouter)

// SECURE

export { router as allAdminRouter }
