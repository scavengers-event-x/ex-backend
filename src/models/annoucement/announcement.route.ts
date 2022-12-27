import { Router } from 'express'

import * as announcementController from './announcement.controller'

const router = Router()

router.get('/', announcementController.conFetchAllPublishedAnnouncements)

router.put('/:id', announcementController.conReadAnnouncement)

export { router as announcementRouter }
