import { ObjectId } from 'mongoose'

import { VenueModel } from './venueModel'
import { getRegexObj } from '../../utils'
import { EVenueType, IVenue, IVenueMain } from './venue.types'
import { COMMON_UN_PROJECTION } from '../../utils/constants'

const fetchAllVenues = (searchValue?: string, expectedPeople?: string, eventDate?: Date, spaceIndoor?: string, spaceOutdoor?: string, venueType?: EVenueType) => {
  const findObject = { deleted: false }
  searchValue && Object.assign(findObject, { name: getRegexObj(searchValue) })
  spaceIndoor && Object.assign(findObject, { spaceIndoor })
  spaceOutdoor && Object.assign(findObject, { spaceOutdoor })
  venueType && Object.assign(findObject, { venueType })
  expectedPeople && Object.assign(findObject, { $and: [{ 'capacity.max': { $gte: expectedPeople } }, { 'capacity.min': { $lte: expectedPeople } }] })
  eventDate && Object.assign(findObject, { 'bookedDates.date': { $ne: new Date(eventDate).toISOString() } })

  return VenueModel.find({ ...findObject }, { ...COMMON_UN_PROJECTION })
}

const fetchVenueById = (id: ObjectId) => {
  return VenueModel.find<IVenueMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION, bookedDates: 0 })
}

const insertVenue = (data: IVenue) => {
  const newVenue = new VenueModel(data)

  return newVenue.save({ validateBeforeSave: true })
}

const updateVenue = (id: ObjectId, data: IVenue) => {
  return VenueModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION, bookedDates: 0 }, returnDocument: 'after', returnOriginal: false })
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
