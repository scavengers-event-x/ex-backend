import { Router } from 'express'

import * as announcementController from './announcement.controller'

const router = Router()

router.route('/')
  .get(announcementController.conFetchAllAnnouncements)
  .post(announcementController.conInsertNewAnnouncement)

router.route('/:id')
  .get(announcementController.conFetchAnnouncementById)
  .put(announcementController.conUpdateAnnouncement)
  .delete(announcementController.conDeleteAnnouncement)

export { router as announcementAdminRouter }
