import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { FieldTypeEventTypeMain } from '../eventType.types'

const eventTypeSchema = new Schema<FieldTypeEventTypeMain>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  deleted: { type: Boolean, default: false }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const EventTypeModel: Model<FieldTypeEventTypeMain> = model(CollectionNames.EVENT_TYPE, eventTypeSchema)

export { EventTypeModel }
