import { ECloudFolderName, getBodyWithFileUrl, makeSuccessObject, Nullable } from '../../utils'
import * as venueQuery from './venue.query'
import { venueMapping } from './venueModel'
import { IVenue, IVenueMain } from './venue.types'
import { commonResponse, venueResponse, responseCode, fileResponse } from '../../utils/constants'
import { UploadApiResponse } from 'cloudinary'
import { destroyImage, uploadImage } from '../../middleware'

const conFetchAllVenues = async (req, res, next) => {
  const { searchValue, expectedPeople, eventDate, spaceIndoor, spaceOutdoor, venueType } = req.query
  try {
    const venues = await venueQuery.fetchAllVenues(searchValue, expectedPeople, eventDate, spaceIndoor, spaceOutdoor, venueType)
    res.status(responseCode.OK)
      .send(makeSuccessObject<IVenueMain[]>(venues, venueResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: venueResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchVenueById = async (req, res, next) => {
  const venueId = req.params.id

  try {
    const venue = await venueQuery.fetchVenueById(venueId)
    if (!venue) {
      return next({ message: venueResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(venue ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<IVenueMain>(venue[0], venueResponse.success.FETCH_BY_ID))
    }
  } catch (_err) {
    next({ message: venueResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
  }
}

const conUpdateVenue = async (req, res, next) => {
  const venueId = req.params.id

  const mappedVenue = venueMapping(req.body)
  if (!mappedVenue) {
    return next({ message: venueResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }

  let fileDetail:Nullable<UploadApiResponse> = null
  try {
    if (req.file.path) {
      fileDetail = await uploadImage(req.file.path, ECloudFolderName.VENUE)
      if (!fileDetail) {
        return next({ message: fileResponse.error.UPLOAD, status: responseCode.INTERNAL_SERVER })
      }
    }
    const venueInSystem = await venueQuery.fetchVenueById(venueId)
    if (!venueInSystem.length) {
      return next({ message: venueResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    if (venueInSystem[0].image.public_id) { await destroyImage(venueInSystem[0].image.public_id) }
    const updatedVenue = await venueQuery.updateVenue(venueId, getBodyWithFileUrl(mappedVenue, fileDetail))
    if (updatedVenue) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<IVenue>(updatedVenue, venueResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: venueResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewVenue = async (req, res, next) => {
  const { name, capacity, contact, location, ...remainingBody } = req.body as IVenue
  if (!name || !capacity) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  let fileDetail:Nullable<UploadApiResponse> = null
  try {
    if (req.file.path) {
      fileDetail = await uploadImage(req.file.path, ECloudFolderName.VENUE)
      if (!fileDetail) {
        return next({ message: fileResponse.error.UPLOAD, status: responseCode.INTERNAL_SERVER })
      }
    }
    const insertRes = await venueQuery.insertVenue(getBodyWithFileUrl({ name, capacity, contact, location, ...remainingBody }, fileDetail))
    if (insertRes) {
      const response = await venueQuery.fetchVenueById(insertRes._id)
      res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
        .send(makeSuccessObject<IVenue>(response[0], venueResponse.success.INSERT))
    }
  } catch (_err) {
    next({ message: venueResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}

const conDeleteVenue = async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await venueQuery.deleteVenue(id)
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<string>(response._id.toString(), venueResponse.success.DELETE))
  } catch (_err) {
    next({ message: venueResponse.error.DELETE, status: responseCode.BAD_REQUEST })
  }
}

export {
  conFetchAllVenues,
  conUpdateVenue,
  conFetchVenueById,
  conInsertNewVenue,
  conDeleteVenue
}
