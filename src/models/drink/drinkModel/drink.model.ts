import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { IDrinkMain, EDrinkCategory } from '../drink.types'

const drinkSchema = new Schema<IDrinkMain>({
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
  alcoholic: {
    type: Boolean,
    required: true
  },
  category: {
    type: String,
    enum: [...Object.values(EDrinkCategory)]
  },
  available: {
    type: Boolean,
    default: true
  },
  deleted: { type: Boolean, default: false }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const DrinkModel: Model<IDrinkMain> = model(CollectionNames.DRINK, drinkSchema)

export { DrinkModel }
