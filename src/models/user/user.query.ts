import { ObjectId, Types } from 'mongoose'

import { UserModel } from './userModel'
import { FunctionWithParamAndReturn, GenericObject } from '../../utils'
import { FieldTypeUserValidStatus, FieldTypeUserInsert } from './user.types'

const userProjection = { category: 1, email: 1, fullName: 1 }

const fetchAllUsers = (id) => {
  return UserModel.find({ _id: { $nin: [new Types.ObjectId(id)] }, deleted: false })
}

const fetchUserById = (id: ObjectId) => {
  return UserModel.findById(id, { ...userProjection })
}

const fetchUserByKeyValue = (object: GenericObject<string>) => {
  return UserModel.findOne(object)
}

const insertUser = (data: FieldTypeUserInsert) => {
  const newUser = new UserModel(data)

  return newUser.save({ validateBeforeSave: true })
}

const getUserValidStatus:FunctionWithParamAndReturn<ObjectId, Promise<FieldTypeUserValidStatus>> = async (userId) => {
  try {
    const user = await UserModel.findById(userId, {})
    return { isInSystem: !!user }
  } catch (err) {
    return { isInSystem: false }
  }
}

const updateUser = (id: ObjectId, data) => {
  return UserModel.findByIdAndUpdate(id, { $set: data }, { projection: { ...userProjection }, returnDocument: 'after', returnOriginal: false })
}

export {
  fetchAllUsers,
  insertUser,
  fetchUserById,
  fetchUserByKeyValue,
  updateUser,
  getUserValidStatus
}
