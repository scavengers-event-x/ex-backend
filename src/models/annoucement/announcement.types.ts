import { ObjectId } from 'mongoose'

interface FieldTypeAnnouncement {
  title: string,
  message: string
  published?: boolean,
}

interface FieldTypeAnnouncementMain extends FieldTypeAnnouncement{
  _id: ObjectId,
  deleted: boolean
  readUserList: ObjectId[],
}

interface FieldTypeAnnouncementVis {
  _id: ObjectId,
  title: string,
  message: string,
  read: boolean
}

export {
  FieldTypeAnnouncement,
  FieldTypeAnnouncementVis,
  FieldTypeAnnouncementMain
}
