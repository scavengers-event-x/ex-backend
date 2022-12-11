import * as eventQuery from './event.query'
import { eventMapping } from './eventModel'
import { makeSuccessObject } from '../../utils'
import { IEvent, IEventMain } from './event.types'
import { eventResponse, commonResponse, responseCode } from '../../utils/constants'

const conFetchAllEvents = async (req, res, next) => {
  try {
    const events = await eventQuery.fetchAllEvents()
    res.status(responseCode.OK)
      .send(makeSuccessObject<IEventMain[]>(events, eventResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: eventResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchEventById = async (req, res, next) => {
  const eventId = req.params.id

  try {
    const event = await eventQuery.fetchEventById(eventId)
    if (!event) {
      return next({ message: eventResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(event ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<IEventMain>(event[0], eventResponse.success.FETCH_BY_ID))
    }
  } catch (_err) {
    next({ message: eventResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
  }
}

const conUpdateEvent = async (req, res, next) => {
  const eventId = req.params.id

  const mappedEvent = eventMapping(req.body)
  if (!mappedEvent) {
    return next({ message: eventResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
  try {
    const eventInSystem = await eventQuery.fetchEventById(eventId)
    if (!eventInSystem.length) {
      return next({ message: eventResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedEvent = await eventQuery.updateEvent(eventId, mappedEvent)
    if (updatedEvent) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<IEvent>(updatedEvent, eventResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: eventResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewEvent = async (req, res, next) => {
  try {
    const insertRes = await eventQuery.insertEvent({ ...req.body })
    if (insertRes) {
      const response = await eventQuery.fetchEventById(insertRes._id)
      res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
        .send(makeSuccessObject<IEvent>(response[0], eventResponse.success.INSERT))
    }
  } catch (_err) {
    next({ message: eventResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}

const conDeleteEvent = async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await eventQuery.deleteEvent(id)
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<string>(response._id.toString(), eventResponse.success.DELETE))
  } catch (_err) {
    next({ message: eventResponse.error.DELETE, status: responseCode.BAD_REQUEST })
  }
}

export {
  conFetchAllEvents,
  conUpdateEvent,
  conFetchEventById,
  conInsertNewEvent,
  conDeleteEvent,
}
