import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { IDecorationMain } from '../decoration.types'

const decorationSchema = new Schema<IDecorationMain>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  deleted: { type: Boolean, default: false }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const DecorationModel: Model<IDecorationMain> = model(CollectionNames.DECORATION, decorationSchema)

export { DecorationModel }
