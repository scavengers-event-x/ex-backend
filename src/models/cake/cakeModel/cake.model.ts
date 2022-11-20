import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { ICakeMain } from '../cake.types'

const cakeSchema = new Schema<ICakeMain>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
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

const CakeModel: Model<ICakeMain> = model(CollectionNames.CAKE, cakeSchema)

export { CakeModel }
