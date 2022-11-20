import { Router } from 'express'

import * as venueController from './venue.controller'

const router = Router()

router.route('/')
  .get(venueController.conFetchAllVenues)
  .post(venueController.conInsertNewVenue)

router.route('/:id')
  .get(venueController.conFetchVenueById)
  .put(venueController.conUpdateVenue)
  .delete(venueController.conDeleteVenue)

export { router as venueRouter }
