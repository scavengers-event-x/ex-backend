import { Model, Schema, model } from 'mongoose'
import { CollectionNames } from '../../../config'
import { FieldTypeUserMain, UserCategory } from '../user.types'

const userSchema = new Schema<FieldTypeUserMain>({
  category: {
    enum: [UserCategory.USER, UserCategory.ADMIN],
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  fullName: {
    type: String
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const UserModel: Model<FieldTypeUserMain> = model(CollectionNames.USER, userSchema)

export { UserModel }
