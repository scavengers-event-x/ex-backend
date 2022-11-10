import { ObjectId } from 'mongoose'

enum UserCategory {
  ADMIN='ADMIN',
  USER='USER'
}

interface FieldTypeUser {
  email: string,
  password: string,
  category: UserCategory
  fullName: string,
}

interface FieldTypeUserMain extends FieldTypeUser {
  _id: ObjectId,
  createdAt: Date,
  deleted: boolean,
  modifiedAt: Date,
}

interface FieldTypeUserJWT {
  userId: ObjectId,
  email: string,
  category: UserCategory,
}

interface FieldTypeUserInsert {
  category: UserCategory.USER,
  email: string,
  fullName: string
}

interface FieldTypeUserUpdate {
  email: string,
  fullName: string
}

interface FieldTypeUserValidStatus {
  isInSystem: boolean
}

export {
  FieldTypeUser,
  FieldTypeUserMain,
  FieldTypeUserJWT,
  FieldTypeUserInsert,
  FieldTypeUserValidStatus,
  FieldTypeUserUpdate,
  UserCategory
}
