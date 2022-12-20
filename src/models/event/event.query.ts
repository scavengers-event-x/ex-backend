import { ObjectId } from 'mongoose'

import { EventModel } from './eventModel'
import { IEvent, IEventMain } from './event.types'
import { COMMON_UN_PROJECTION } from '../../utils/constants'

// const findOptions = {
//   populate: [
//     'theme',
//     'venue',
//     'userId',
//     'assignedStaff',
//     'drinks._id',
//     'cakes',
//     'decorations'
//   ]
// }

const findOptions = {
  populate: [
    { path: 'theme', select: '-_id name' },
    { path: 'venue', select: '-_id name location' },
    { path: 'userId', select: '-_id profile email' },
    { path: 'assignedStaff', select: '-_id profile email' },
    { path: 'drinks._id', select: '-_id name image.url' },
    { path: 'cakes._id', select: '-_id name image.url' },
    { path: 'decorations', select: '-_id name image.url' }
  ]
}
const fetchAllEvents = () => {
  return EventModel.find({ deleted: false }, { ...COMMON_UN_PROJECTION })
}
const fetchAllEventsOfUserId = (additionalFields: {userId?: ObjectId, assignedStaff?: ObjectId}) => {
  return EventModel.find({ deleted: false, ...additionalFields }, { ...COMMON_UN_PROJECTION }, { ...findOptions })
}

const fetchEventById = (id: ObjectId) => {
  return EventModel.find<IEventMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION }, { ...findOptions })
}

const insertEvent = (data: IEvent) => {
  const newEvent = new EventModel(data)

  return newEvent.save({ validateBeforeSave: true })
}

const updateEvent = (id: ObjectId, data: IEvent) => {
  return EventModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false, populate: findOptions.populate })
}

const assignStaffToEvent = (id: ObjectId, staffId: ObjectId) => {
  return EventModel.findByIdAndUpdate(id, { $set: { assignedStaff: staffId } }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false, populate: findOptions.populate })
}

const deleteEvent = (id: ObjectId) => {
  return EventModel.findByIdAndUpdate(id, { $set: { deleted: true } }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false, populate: findOptions.populate })
}

export {
  fetchAllEventsOfUserId,
  assignStaffToEvent,
  fetchAllEvents,
  fetchEventById,
  insertEvent,
  updateEvent,
  deleteEvent
}
