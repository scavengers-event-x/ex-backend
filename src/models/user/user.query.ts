import { ObjectId } from 'mongoose'

import { UserModel } from './userModel'
import { FunctionWithParamAndReturn, GenericObject } from '../../utils'
import { FieldTypeUserRegister, FieldTypeUserValidStatus, UserAccountStatus, UserCategory } from './user.types'

const userProjection = {
  accountStatus: 1, category: 1, email: 1, image: 1, isVerified: 1, profile: 1
}

const fetchAllUsers = () => {
  return UserModel.find({}, { ...userProjection })
}

const fetchUserById = (id: ObjectId) => {
  return UserModel.findById(id, { ...userProjection })
}

const fetchUserCredential = (id: ObjectId) => {
  return UserModel.findById(id, { ...userProjection, password: 1 })
}

const fetchUserByKeyValue = (object: GenericObject<string>) => {
  return UserModel.findOne(object)
}

const insertUser = (data: FieldTypeUserRegister) => {
  const newUser = new UserModel(data)

  return newUser.save({ validateBeforeSave: true })
}

const getUserValidStatus:FunctionWithParamAndReturn<ObjectId, Promise<FieldTypeUserValidStatus>> = async (userId) => {
  try {
    const user = await UserModel.findById(userId, {})

    return { isActive: user?.get('accountStatus') === UserAccountStatus.ACTIVE, isInSystem: !!user }
  } catch (err) {
    return { isActive: false, isInSystem: false }
  }
}

const updateUser = (id: ObjectId, data) => {
  return UserModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...userProjection }, returnDocument: 'after', returnOriginal: false })
}

const fetchUsersByCategory = (category: UserCategory) => {
  return UserModel.find({ category }, { _id: 1, email: 1, image: 1, profile: 1 })
}

export {
  fetchAllUsers,
  fetchUserCredential,
  fetchUserById,
  fetchUserByKeyValue,
  insertUser,
  updateUser,
  getUserValidStatus,
  fetchUsersByCategory
}
