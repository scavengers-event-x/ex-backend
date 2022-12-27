import { FieldTypeAnnouncement } from '../announcement.types'

export const announcementMapping = (data2: FieldTypeAnnouncement): FieldTypeAnnouncement => {
  const data1: FieldTypeAnnouncement = {} as FieldTypeAnnouncement
  if (data2) {
    if (data2.title) data1.title = data2.title
    if (data2.message) data1.message = data2.message
    if (typeof data2.published === 'boolean') data1.published = data2.published
  }

  return data1
}
