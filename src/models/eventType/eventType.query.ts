import { ObjectId } from 'mongoose'

import { getRegexObj } from '../../utils'
import { EventTypeModel } from './eventTypeModel'
import { COMMON_UN_PROJECTION } from '../../utils/constants'
import { FieldTypeEventType, FieldTypeEventTypeMain } from './eventType.types'

const fetchAllEventTypes = (searchValue?: string) => {
  const findObject = { deleted: false }
  searchValue && Object.assign(findObject, { name: getRegexObj(searchValue) })
  return EventTypeModel.find({ ...findObject }, { ...COMMON_UN_PROJECTION })
}

const fetchEventTypeById = (id: ObjectId) => {
  return EventTypeModel.find<FieldTypeEventTypeMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION })
}

const insertEventType = (data: FieldTypeEventType) => {
  const newEventType = new EventTypeModel(data)

  return newEventType.save({ validateBeforeSave: true })
}

const updateEventType = (id: ObjectId, data: FieldTypeEventType) => {
  return EventTypeModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION }, returnDocument: 'after', returnOriginal: false })
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
