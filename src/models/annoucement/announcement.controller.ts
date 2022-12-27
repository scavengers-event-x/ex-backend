import { makeSuccessObject } from '../../utils'
import * as announcementQuery from './announcement.query'
import { announcementMapping } from './announcementModel'
import { FieldTypeAnnouncement, FieldTypeAnnouncementMain, FieldTypeAnnouncementVis } from './announcement.types'
import { commonResponse, announcementResponse, responseCode } from '../../utils/constants'
import { FieldTypeUserJWT } from '../user'

const conFetchAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await announcementQuery.fetchAllAnnouncements()
    res.status(responseCode.OK)
      .send(makeSuccessObject<FieldTypeAnnouncementMain[]>(announcements, announcementResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: announcementResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchAllPublishedAnnouncements = async (req, res, next) => {
  const { userId } = req.loggedInUser as FieldTypeUserJWT
  try {
    const announcements = await announcementQuery.fetchAllPublishedAnnouncements()
    const visAnnouncements = announcements.map<FieldTypeAnnouncementVis>((ann) => ({ message: ann.message, title: ann.title, read: ann.readUserList.includes(userId) }))
    res.status(responseCode.OK)
      .send(makeSuccessObject<FieldTypeAnnouncementVis[]>(visAnnouncements, announcementResponse.success.FETCH_ALL))
  } catch (_err) {
    next({ message: announcementResponse.error.FETCH_ALL, status: responseCode.BAD_REQUEST })
  }
}

const conFetchAnnouncementById = async (req, res, next) => {
  const announcementId = req.params.id

  try {
    const announcement = await announcementQuery.fetchAnnouncementById(announcementId)
    if (!announcement) {
      return next({ message: announcementResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(announcement ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<FieldTypeAnnouncementMain>(announcement[0], announcementResponse.success.FETCH_BY_ID))
    }
  } catch (_err) {
    next({ message: announcementResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
  }
}

const conUpdateAnnouncement = async (req, res, next) => {
  const announcementId = req.params.id

  const mappedAnnouncement = announcementMapping(req.body)
  if (!mappedAnnouncement) {
    return next({ message: announcementResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }

  try {
    const announcementInSystem = await announcementQuery.fetchAnnouncementById(announcementId)
    if (!announcementInSystem.length) {
      return next({ message: announcementResponse.error.NOT_FOUND, status: responseCode.BAD_REQUEST })
    }
    if (announcementInSystem[0].published) {
      return next({ message: `${announcementResponse.error.UPDATE} ${announcementResponse.error.ALREADY_PUBLISHED}`, status: responseCode.BAD_REQUEST })
    }
    const updatedAnnouncement = await announcementQuery.updateAnnouncement(announcementId, mappedAnnouncement)
    if (updatedAnnouncement) {
      res.status(responseCode.ACCEPTED).send(makeSuccessObject<FieldTypeAnnouncement>(updatedAnnouncement, announcementResponse.success.UPDATE))
    }
  } catch (err) {
    next({ message: announcementResponse.error.UPDATE, status: responseCode.BAD_REQUEST })
  }
}

const conInsertNewAnnouncement = async (req, res, next) => {
  const { message, title, published } = req.body as FieldTypeAnnouncement
  if (!title || !message) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const insertRes = await announcementQuery.insertAnnouncement({ title, message, published: published || false })
    if (insertRes) {
      const response = await announcementQuery.fetchAnnouncementById(insertRes._id)
      res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
        .send(makeSuccessObject<FieldTypeAnnouncement>(response[0], announcementResponse.success.INSERT))
    }
  } catch (_err) {
    next({ message: announcementResponse.error.INSERT, status: responseCode.BAD_REQUEST })
  }
}

const conDeleteAnnouncement = async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next({ message: commonResponse.error.INVALID_BODY, status: responseCode.BAD_REQUEST })
  }
  try {
    const response = await announcementQuery.deleteAnnouncement(id)
    res.status(response ? responseCode.OK : responseCode.INTERNAL_SERVER)
      .send(makeSuccessObject<string>(response._id.toString(), announcementResponse.success.DELETE))
  } catch (_err) {
    next({ message: announcementResponse.error.DELETE, status: responseCode.BAD_REQUEST })
  }
}

const conReadAnnouncement = async (req, res, next) => {
  const announcementId = req.params.id
  const { userId } = req.loggedInUser as FieldTypeUserJWT

  try {
    const announcement = await announcementQuery.readAnnouncement(announcementId, userId)
    if (!announcement) {
      return next({ message: announcementResponse.error.FETCH_BY_ID, status: responseCode.BAD_REQUEST })
    } else {
      res.status(announcement ? responseCode.OK : responseCode.OK)
        .send(makeSuccessObject<FieldTypeAnnouncementMain>(announcement[0], announcementResponse.success.READ))
    }
  } catch (_err) {
    next({ message: announcementResponse.error.READ, status: responseCode.BAD_REQUEST })
  }
}

export {
  conFetchAllPublishedAnnouncements,
  conFetchAllAnnouncements,
  conUpdateAnnouncement,
  conFetchAnnouncementById,
  conInsertNewAnnouncement,
  conDeleteAnnouncement,
  conReadAnnouncement
}
