import { ObjectId } from 'mongoose'

import { VenueModel } from './venueModel'
import { IVenue, IVenueMain } from './venue.types'

const venueProjection = {
  name: 1,
  location: 1,
  contact: 1,
  capacity: 1,
  price: 1
}

const fetchAllVenues = () => {
  return VenueModel.find({ deleted: false })
}

const fetchVenueById = (id: ObjectId) => {
  return VenueModel.find<IVenueMain>({ deleted: false, _id: id }, { ...venueProjection })
}

const insertVenue = (data: IVenue) => {
  const newVenue = new VenueModel(data)

  return newVenue.save({ validateBeforeSave: true })
}

const updateVenue = (id: ObjectId, data: IVenue) => {
  return VenueModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...venueProjection }, returnDocument: 'after', returnOriginal: false })
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
