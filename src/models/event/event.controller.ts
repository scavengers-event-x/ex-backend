import * as eventQuery from './event.query'
import { eventMapping } from './eventModel'
import { ECloudFolderName, makeSuccessObject, Nullable } from '../../utils'
import { IEvent, IEventMain } from './event.types'
import { commonResponse, eventResponse, fileResponse, responseCode, userResponse } from '../../utils/constants'
import { FieldTypeUserJWT, UserCategory } from '../user'
import { UploadApiResponse } from 'cloudinary'
import { destroyImage, uploadImage } from '../../middleware'

const conFetchAllEvents = async (req, res, next) => {
  try {
    const events = await eventQuery.fetchAllEvents()
    res.status(responseCode.OK)
      .send(makeSuccessObject<IEventMain[]>(events, eventResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: eventResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchAllEventsOfLoggedInUser = async (req, res, next) => {
  const { userId, category } = req.loggedInUser as FieldTypeUserJWT
  const additionalFilter = category === UserCategory.CUSTOMER ? { userId } : category === UserCategory.STAFF ? { assignedStaff: userId } : {}
  try {
    const events = await eventQuery.fetchAllEventsOfUserId({ ...additionalFilter })
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
  let fileDetail:Nullable<UploadApiResponse> = null
  try {
    const eventInSystem = await eventQuery.fetchEventById(eventId)
    if (!eventInSystem.length) {
      return next({ message: eventResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }

    if (req.file?.path) {
      fileDetail = await uploadImage(req.file?.path, ECloudFolderName.EVENT)
      if (!fileDetail) {
        return next({ message: fileResponse.error.UPLOAD, status: responseCode.INTERNAL_SERVER })
      }
      Object.assign(mappedEvent, { customCake: { ...eventInSystem[0].customCake, image: { url: fileDetail.url, public_id: fileDetail.public_id } } })
    }

    if (req.body.customCakePound) {
      Object.assign(mappedEvent, { customCake: { image: fileDetail ? mappedEvent.customCake.image : eventInSystem[0].customCake.image, pound: req.body.customCakePound } })
    }

    if (eventInSystem[0].customCake.image.public_id && fileDetail) { await destroyImage(eventInSystem[0].customCake.image.public_id) }

    const updatedEvent = await eventQuery.updateEvent(eventId, mappedEvent)
    if (updatedEvent) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<IEvent>(updatedEvent, eventResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: eventResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conAssignStaffToEvent = async (req, res, next) => {
  const eventId = req.params.id
  const { userId, category } = req.loggedInUser as FieldTypeUserJWT

  if (!userId || category !== UserCategory.STAFF) {
    return next({ message: userResponse.error.USER_NOT_FOUND, status: responseCode.BAD_REQUEST })
  }
  try {
    const eventInSystem = await eventQuery.fetchEventById(eventId)
    if (!eventInSystem.length) {
      return next({ message: eventResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    const updatedEvent = await eventQuery.assignStaffToEvent(eventId, userId)
    if (updatedEvent) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<IEvent>(updatedEvent, eventResponse.success.ASSIGN))
    }
  } catch (err) {
    next({ message: eventResponse.error.ASSIGN, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewEvent = async (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT
  if (req.file) {
    console.log('req: ', req.file)
  }
  let fileDetail:Nullable<UploadApiResponse> = null
  try {
    if (req.file?.path) {
      fileDetail = await uploadImage(req.file?.path, ECloudFolderName.EVENT)
      if (!fileDetail) {
        return next({ message: fileResponse.error.UPLOAD, status: responseCode.INTERNAL_SERVER })
      }
    }
    const updatedBody = fileDetail
      ? { ...req.body, customCake: { image: { url: fileDetail.url, public_id: fileDetail.public_id }, pound: req.body.customCakePound }, userId }
      : { ...req.body, userId }
    const insertRes = await eventQuery.insertEvent(updatedBody)
    if (insertRes) {
      const response = await eventQuery.fetchEventById(insertRes._id)
      res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
        .send(makeSuccessObject<IEvent>(response[0], eventResponse.success.INSERT))
    }
  } catch (_err) {
    console.log('error: ', _err)
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
  conAssignStaffToEvent,
  conFetchAllEventsOfLoggedInUser
}
