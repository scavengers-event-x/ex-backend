import { Router } from 'express'

import * as venueController from './venue.controller'

const router = Router()

router.get('/', venueController.conFetchAllVenues)

router.get('/:id', venueController.conFetchVenueById)

export { router as venueRouter }
