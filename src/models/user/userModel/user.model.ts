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
    url: String,
    public_id: String
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
  access: {
    type: Boolean,
    default: true
  },
  passwordResetRequestDate: {
    type: Date,
    default: null
  },
  lastPasswordDefaultResetDate: {
    type: Number,
    default: null
  },
  profile: {
    address: {
      province: { type: String },
      city: { type: String },
      ward: { type: Number },
      tole: { type: String }
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
    },
    citizenship: {
      type: String
    },
    pan: {
      type: Number
    }
  },
  chatUserList: [{
    type: Schema.Types.ObjectId,
    ref: CollectionNames.USER
  }]
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const UserModel: Model<FieldTypeUserMain> = model(CollectionNames.USER, userSchema)

export { UserModel }
