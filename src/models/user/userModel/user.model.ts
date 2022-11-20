import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { FieldTypeUserMain, UserAccountStatus, UserCategory, UserGender, UserOperations } from '../user.types'

const userSchema = new Schema<FieldTypeUserMain>({
  accountStatus: {
    default: UserAccountStatus.ACTIVE,
    enum: [UserAccountStatus.ACTIVE, UserAccountStatus.DE_ACTIVE],
    type: String
  },
  category: {
    enum: [UserCategory.CUSTOMER, UserCategory.STAFF, UserCategory.MANAGER],
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  image: {
    type: String
  },
  isVerified: {
    default: false,
    type: Boolean
  },
  operation: {
    enum: [UserOperations.DEACTIVATION, UserOperations.FORGOT_PASSWORD, UserOperations.RESET_PASSWORD, UserOperations.REACTIVATION, UserOperations.REGISTER],
    type: String
  },
  otpCode: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  password: {
    required: true,
    type: String
  },
  profile: {
    address: {
      type: String
    },
    gender: {
      enum: [UserGender.MALE, UserGender.FEMALE, UserGender.OTHERS],
      type: String
    },
    fullName: {
      type: String
    },
    phone: {
      type: String
    }
  }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const UserModel: Model<FieldTypeUserMain> = model(CollectionNames.USER, userSchema)

export { UserModel }