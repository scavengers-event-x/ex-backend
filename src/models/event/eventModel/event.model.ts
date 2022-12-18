import { Model, model, Schema } from 'mongoose'

import { IEventMain } from '../event.types'
import { CollectionNames } from '../../../config'

const eventSchema = new Schema<IEventMain>({
  eventType: { type: String, required: true },
  venue: { type: Schema.Types.ObjectId, ref: CollectionNames.VENUE },
  date: Date,
  numberOfPeople: Number,
  theme: { type: Schema.Types.ObjectId, ref: CollectionNames.THEME },
  userId: { type: Schema.Types.ObjectId, ref: CollectionNames.USER, required: true },
  assignedStaff: { type: Schema.Types.ObjectId, ref: CollectionNames.USER },
  active: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
  drinks: [{
    _id: { type: Schema.Types.ObjectId, ref: CollectionNames.DRINK },
    quantity: Number
  }],
  cakes: [{
    _id: { type: Schema.Types.ObjectId, ref: CollectionNames.CAKE },
    pound: Number
  }],
  decorations: [{ type: Schema.Types.ObjectId, ref: CollectionNames.DECORATION }],
  deleted: { type: Boolean, default: false }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const EventModel: Model<IEventMain> = model(CollectionNames.EVENT, eventSchema)

export { EventModel }
