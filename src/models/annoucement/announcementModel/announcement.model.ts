import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { FieldTypeAnnouncementMain } from '../announcement.types'

const eventTypeSchema = new Schema<FieldTypeAnnouncementMain>({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  readUserList: {
    type: [Schema.Types.ObjectId],
    ref: CollectionNames.USER
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: 'modifiedAt'
  }
})

const AnnouncementModel: Model<FieldTypeAnnouncementMain> = model(CollectionNames.ANNOUNCEMENT, eventTypeSchema)

export { AnnouncementModel }
