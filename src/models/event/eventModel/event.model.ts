import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { IEventMain } from '../event.types'

const cakeSchema = new Schema<IEventMain>({
  eventType: { type: String, required: true },
  venue: { type: Schema.Types.ObjectId, ref: CollectionNames.VENUE },
  date: Date,
  numberOfPeople: Number,
  theme: { type: Schema.Types.ObjectId, ref: CollectionNames.THEME },
  drinks: [{ _id: { type: Schema.Types.ObjectId, ref: CollectionNames.DRINK }, quantity: Number }],
  cakes: [{ type: Schema.Types.ObjectId, ref: CollectionNames.CAKE }],
  decorations: [{ type: Schema.Types.ObjectId, ref: CollectionNames.DECORATION }],
  deleted: { type: Boolean, default: false }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const EventModel: Model<IEventMain> = model(CollectionNames.CAKE, cakeSchema)

export { EventModel }
