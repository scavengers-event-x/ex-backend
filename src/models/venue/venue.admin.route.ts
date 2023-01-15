import { Router } from 'express'

import { multerSingleImage } from '../../middleware'
import * as venueController from './venue.controller'

const router = Router()

router.route('/')
  .get(venueController.conFetchAllVenues)
  .post(venueController.conInsertNewVenue)

router.route('/:id')
  .get(venueController.conFetchVenueById)
  .put(venueController.conUpdateVenue)
  .delete(venueController.conDeleteVenue)

router.put('/upload/:id', multerSingleImage(), venueController.conUpdateVenueAfterUpload)

export { router as venueAdminRouter }
