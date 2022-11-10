import { Router } from 'express'

import { userRouter } from './models'

const router = Router()

// UNSECURE
router.use('/user', userRouter)

// SECURE

export { router as allRouter }
