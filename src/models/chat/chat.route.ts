import { Router } from 'express'

import * as chatController from './chat.controller'

const router = Router()

router.route('/')
  .get(chatController.conFetchAllChats)
  .post(chatController.conInsertNewChat)

export { router as chatRouter }
