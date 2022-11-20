import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { IThemeMain } from '../theme.types'

const themeSchema = new Schema<IThemeMain>({
  name: {
    type: String,
    required: true
  },
  speciality: {
    type: [String],
    required: true
  },
  description: {
    type: String
  },
  deleted: { type: Boolean, default: false }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const ThemeModel: Model<IThemeMain> = model(CollectionNames.THEME, themeSchema)

export { ThemeModel }
