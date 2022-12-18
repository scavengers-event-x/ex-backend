import { Router } from 'express'

import { multerSingleImage } from '../../middleware'
import * as venueController from './venue.controller'

const router = Router()

router.route('/')
  .get(venueController.conFetchAllVenues)
  .post(multerSingleImage(), venueController.conInsertNewVenue)

router.route('/:id')
  .get(venueController.conFetchVenueById)
  .put(multerSingleImage(), venueController.conUpdateVenue)
  .delete(venueController.conDeleteVenue)

export { router as venueAdminRouter }
