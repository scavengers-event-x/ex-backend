import { ObjectId } from 'mongoose'

import { VenueModel } from './venueModel'
import { IVenue, IVenueMain } from './venue.types'
import { COMMON_UN_PROJECTION } from '../../utils/constants'

const fetchAllVenues = () => {
  return VenueModel.find({ deleted: false }, { ...COMMON_UN_PROJECTION })
}

const fetchVenueById = (id: ObjectId) => {
  return VenueModel.find<IVenueMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION })
}

const insertVenue = (data: IVenue) => {
  const newVenue = new VenueModel(data)

  return newVenue.save({ validateBeforeSave: true })
}

const updateVenue = (id: ObjectId, data: IVenue) => {
  return VenueModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const deleteVenue = (id: ObjectId) => {
  return VenueModel.findByIdAndUpdate(id, { $set: { deleted: true } })
}

export {
  fetchAllVenues,
  fetchVenueById,
  insertVenue,
  updateVenue,
  deleteVenue
}
