import { ObjectId } from 'mongoose'

import { EventModel } from './eventModel'
import { IEvent, IEventMain } from './event.types'
import { COMMON_UN_PROJECTION } from '../../utils/constants'

const fetchAllEvents = () => {
  return EventModel.find({ deleted: false }, { ...COMMON_UN_PROJECTION })
}

const fetchEventById = (id: ObjectId) => {
  return EventModel.find<IEventMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION })
}

const insertEvent = (data: IEvent) => {
  const newEvent = new EventModel(data)

  return newEvent.save({ validateBeforeSave: true })
}

const updateEvent = (id: ObjectId, data: IEvent) => {
  return EventModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

const deleteEvent = (id: ObjectId) => {
  return EventModel.findByIdAndUpdate(id, { $set: { deleted: true } }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
}

export {
  fetchAllEvents,
  fetchEventById,
  insertEvent,
  updateEvent,
  deleteEvent,
}
