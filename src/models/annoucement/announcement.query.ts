import { ObjectId } from 'mongoose'

import { AnnouncementModel } from './announcementModel'
import { COMMON_UN_PROJECTION } from '../../utils/constants'
import { FieldTypeAnnouncement, FieldTypeAnnouncementMain } from './announcement.types'

const fetchAllAnnouncements = () => {
  return AnnouncementModel.find({ deleted: false }, { ...COMMON_UN_PROJECTION })
}

const fetchAllPublishedAnnouncements = () => {
  return AnnouncementModel.find({ deleted: false, published: true }, { ...COMMON_UN_PROJECTION, published: 0 })
}

const fetchAnnouncementById = (id: ObjectId) => {
  return AnnouncementModel.find<FieldTypeAnnouncementMain>({ deleted: false, _id: id }, { ...COMMON_UN_PROJECTION, readUserList: 0 })
}

const insertAnnouncement = (data: FieldTypeAnnouncement) => {
  const newAnnouncement = new AnnouncementModel(data)

  return newAnnouncement.save({ validateBeforeSave: true })
}

const updateAnnouncement = (id: ObjectId, data: FieldTypeAnnouncement) => {
  return AnnouncementModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...COMMON_UN_PROJECTION, readUserList: 0 }, returnDocument: 'after', returnOriginal: false })
}

const deleteAnnouncement = (id: ObjectId) => {
  return AnnouncementModel.findByIdAndUpdate(id, { $set: { deleted: true } })
}

const readAnnouncement = (id: ObjectId, userId: ObjectId) => {
  return AnnouncementModel.findByIdAndUpdate(id, { $push: { readUserList: userId } }, { projection: { ...COMMON_UN_PROJECTION, readUserList: 0 }, returnDocument: 'after', returnOriginal: false })
}

export {
  fetchAllPublishedAnnouncements,
  fetchAllAnnouncements,
  fetchAnnouncementById,
  insertAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  readAnnouncement
}
