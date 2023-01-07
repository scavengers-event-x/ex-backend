import { Router } from 'express'

import {
  themeAdminRouter,
  venueAdminRouter,
  cakeAdminRouter,
  decorationAdminRouter,
  drinkAdminRouter,
  eventRouter,
  userAdminRouter,
  announcementAdminRouter, UserCategory, chatRouter
} from './models'
import { authenticator, authorizerCategory } from './middleware'

const authorizerManager = authorizerCategory(UserCategory.MANAGER)

const router = Router()

// UNSECURE
router.use('/user', userAdminRouter)

router.use(authenticator)
router.use('/event', eventRouter)
router.use('/chat', chatRouter)

router.use(authorizerManager)
router.use('/cake', cakeAdminRouter)
router.use('/theme', themeAdminRouter)
router.use('/venue', venueAdminRouter)
router.use('/drink', drinkAdminRouter)
router.use('/decoration', decorationAdminRouter)
router.use('/announcement', announcementAdminRouter)

// SECURE

export { router as allAdminRouter }
