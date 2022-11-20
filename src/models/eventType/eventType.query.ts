import { ObjectId } from 'mongoose'

import { EventTypeModel } from './eventTypeModel'
import {FieldTypeEventType, FieldTypeEventTypeMain} from './eventType.types'

const eventTypeProjection = { name: 1, description: 1 }

const fetchAllEventTypes = () => {
  return EventTypeModel.find({ deleted: false })
}

const fetchEventTypeById = (id: ObjectId) => {
  return EventTypeModel.find<FieldTypeEventTypeMain>({ deleted: false, _id: id }, { ...eventTypeProjection })
}

const insertEventType = (data: FieldTypeEventType) => {
  const newEventType = new EventTypeModel(data)

  return newEventType.save({ validateBeforeSave: true })
}

const updateEventType = (id: ObjectId, data: FieldTypeEventType) => {
  return EventTypeModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...eventTypeProjection }, returnDocument: 'after', returnOriginal: false })
}

const deleteEventType = (id: ObjectId) => {
  return EventTypeModel.findByIdAndUpdate(id, { $set: { deleted: true } })
}

export {
  fetchAllEventTypes,
  fetchEventTypeById,
  insertEventType,
  updateEventType,
  deleteEventType
}
