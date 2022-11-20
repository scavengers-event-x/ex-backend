import { makeSuccessObject } from '../../utils'
import * as eventTypeQuery from './eventType.query'
import { eventTypeMapping } from './eventTypeModel'
import { FieldTypeEventType, FieldTypeEventTypeMain } from './eventType.types'
import { commonResponse, eventTypeResponse, responseCode } from '../../utils/constants'

const conFetchAllEventTypes = async (req, res, next) => {
  try {
    const eventTypes = await eventTypeQuery.fetchAllEventTypes()
    res.status(responseCode.OK)
      .send(makeSuccessObject<FieldTypeEventTypeMain[]>(eventTypes, eventTypeResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: eventTypeResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchEventTypeById = async (req, res, next) => {
  const eventTypeId = req.params.id

  try {
    const eventType = await eventTypeQuery.fetchEventTypeById(eventTypeId)
    if (!eventType) {
      return next({ message: eventTypeResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(eventType ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<FieldTypeEventTypeMain>(eventType[0], eventTypeResponse.success.FETCH_BY_ID))
    }
  } catch (_err) {
    next({ message: eventTypeResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
  }
}

const conUpdateEventType = async (req, res, next) => {
  const eventTypeId = req.params.id

  const mappedEventType = eventTypeMapping(req.body)
  if (!mappedEventType) {
    return next({ message: eventTypeResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }

  try {
    const eventTypeInSystem = await eventTypeQuery.fetchEventTypeById(eventTypeId)
    if (!eventTypeInSystem.length) {
      return next({ message: eventTypeResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedEventType = await eventTypeQuery.updateEventType(eventTypeId, mappedEventType)
    if (updatedEventType) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeEventType>(updatedEventType, eventTypeResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: eventTypeResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewEventType = async (req, res, next) => {
  const { description, name } = req.body as FieldTypeEventType
  if (!name) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await eventTypeQuery.insertEventType({ description, name })
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<FieldTypeEventType>(response, eventTypeResponse.success.INSERT))
  } catch (_err) {
    next({ message: eventTypeResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}

const conDeleteEventType = async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await eventTypeQuery.deleteEventType(id)
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<FieldTypeEventType>(response, eventTypeResponse.success.DELETE))
  } catch (_err) {
    next({ message: eventTypeResponse.error.DELETE, status: responseCode.BAD_REQUEST })
  }
}

export {
  conFetchAllEventTypes,
  conUpdateEventType,
  conFetchEventTypeById,
  conInsertNewEventType,
  conDeleteEventType
}
